import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { LeadForm } from "@/components/ui/lead-form";

// Cache motion components so React keeps stable refs across renders
const motionComponentCache = new Map<string, React.FC>();

vi.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get: (_t, prop: string) => {
        if (!motionComponentCache.has(prop)) {
          const MotionComponent = React.forwardRef(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (
              {
                children,
                variants,
                initial,
                animate,
                exit,
                transition,
                whileTap,
                whileHover,
                onAnimationComplete,
                layout,
                layoutId,
                ...rest
              }: any,
              ref: any,
            ) => React.createElement(prop, { ...rest, ref }, children),
          );
          MotionComponent.displayName = `motion.${prop}`;
          motionComponentCache.set(
            prop,
            MotionComponent as unknown as React.FC,
          );
        }
        return motionComponentCache.get(prop);
      },
    },
  ),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("@/components/ui/cta-button", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CtaButton: ({ children, ...rest }: any) => (
    <button type="submit" data-testid="cta-button" {...rest}>
      {children}
    </button>
  ),
}));

vi.mock("@/lib/leads", () => ({
  saveLead: vi.fn(),
}));

vi.mock("@/lib/attribution", () => ({
  getAttribution: vi.fn(() => ({ source: "test" })),
}));

vi.mock("@/lib/lead-session", () => ({
  setLeadId: vi.fn(),
}));

vi.mock("@/lib/actions/save-lead", () => ({
  createLead: vi.fn(),
}));

import { saveLead } from "@/lib/leads";
import { createLead } from "@/lib/actions/save-lead";
import { setLeadId } from "@/lib/lead-session";

const mockOnSubmit = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  (createLead as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
    success: true,
    data: { leadId: "test-uuid-123" },
  });
});

// Fills all fields with valid values and submits.
async function fillValidAndSubmit(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Tu nombre"), "Maria Garcia");
  await user.type(screen.getByLabelText("Tu correo"), "maria@example.com");
  await user.type(screen.getByLabelText("Tu WhatsApp"), "6141234567");
  await user.selectOptions(
    screen.getByLabelText("En qué grado vas"),
    "prepa_3",
  );
  await user.click(screen.getByRole("checkbox"));
  await user.click(screen.getByText("Empezar"));
}

describe("LeadForm — rendering", () => {
  it("renders the heading", () => {
    render(<LeadForm variant="test1" onSubmit={mockOnSubmit} />);
    expect(screen.getByText("Antes de empezar")).toBeInTheDocument();
  });

  it("renders all input fields", () => {
    render(<LeadForm variant="test1" onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText("Tu nombre")).toBeInTheDocument();
    expect(screen.getByLabelText("Tu correo")).toBeInTheDocument();
    expect(screen.getByLabelText("Tu WhatsApp")).toBeInTheDocument();
    expect(screen.getByLabelText("En qué grado vas")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(<LeadForm variant="test1" onSubmit={mockOnSubmit} />);
    expect(screen.getByText("Empezar")).toBeInTheDocument();
  });
});

describe("LeadForm — validation", () => {
  it("blocks submit when name is empty", async () => {
    const user = userEvent.setup();
    render(<LeadForm variant="test1" onSubmit={mockOnSubmit} />);
    await user.click(screen.getByText("Empezar"));
    expect(screen.getByText("Escribe tu nombre")).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(createLead).not.toHaveBeenCalled();
  });

  it("blocks submit when email is empty", async () => {
    const user = userEvent.setup();
    render(<LeadForm variant="test1" onSubmit={mockOnSubmit} />);
    await user.type(screen.getByLabelText("Tu nombre"), "Maria");
    await user.click(screen.getByText("Empezar"));
    expect(screen.getByText("Escribe tu correo")).toBeInTheDocument();
  });

  it("blocks submit when email format is invalid", async () => {
    const user = userEvent.setup();
    render(<LeadForm variant="test1" onSubmit={mockOnSubmit} />);
    await user.type(screen.getByLabelText("Tu nombre"), "Maria");
    await user.type(screen.getByLabelText("Tu correo"), "not-an-email");
    await user.click(screen.getByText("Empezar"));
    expect(screen.getByText("Correo inválido")).toBeInTheDocument();
  });

  it("blocks submit when grade is not selected", async () => {
    const user = userEvent.setup();
    render(<LeadForm variant="test1" onSubmit={mockOnSubmit} />);
    await user.type(screen.getByLabelText("Tu nombre"), "Maria");
    await user.type(screen.getByLabelText("Tu correo"), "maria@example.com");
    await user.type(screen.getByLabelText("Tu WhatsApp"), "6141234567");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByText("Empezar"));
    expect(screen.getByText("Selecciona tu grado")).toBeInTheDocument();
  });

  it("blocks submit when consent is unchecked", async () => {
    const user = userEvent.setup();
    render(<LeadForm variant="test1" onSubmit={mockOnSubmit} />);
    await user.type(screen.getByLabelText("Tu nombre"), "Maria");
    await user.type(screen.getByLabelText("Tu correo"), "maria@example.com");
    await user.type(screen.getByLabelText("Tu WhatsApp"), "6141234567");
    await user.selectOptions(
      screen.getByLabelText("En qué grado vas"),
      "prepa_3",
    );
    await user.click(screen.getByText("Empezar"));
    expect(
      screen.getByText("Tienes que aceptar para continuar"),
    ).toBeInTheDocument();
  });
});

describe("LeadForm — successful submission", () => {
  it("calls createLead with normalized inputs", async () => {
    const user = userEvent.setup();
    render(<LeadForm variant="test1" onSubmit={mockOnSubmit} />);
    await fillValidAndSubmit(user);

    await waitFor(() => {
      expect(createLead).toHaveBeenCalledOnce();
    });

    expect(createLead).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Maria Garcia",
        email: "maria@example.com",
        phone: "6141234567",
        grade: "prepa_3",
        consentMarketing: true,
      }),
    );
  });

  it("caches lead in localStorage, sets leadId, and calls onSubmit", async () => {
    const user = userEvent.setup();
    render(<LeadForm variant="test1" onSubmit={mockOnSubmit} />);
    await fillValidAndSubmit(user);

    await waitFor(() => {
      expect(saveLead).toHaveBeenCalledOnce();
    });
    expect(setLeadId).toHaveBeenCalledWith("test-uuid-123");
    expect(mockOnSubmit).toHaveBeenCalledOnce();
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Maria Garcia",
        email: "maria@example.com",
        whatsapp: "6141234567",
        grade: "prepa_3",
      }),
    );
  });
});

describe("LeadForm — server error handling", () => {
  it("shows server error and does not call onSubmit", async () => {
    (createLead as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      success: false,
      error: "Ese dominio de correo no existe.",
    });

    const user = userEvent.setup();
    render(<LeadForm variant="test1" onSubmit={mockOnSubmit} />);
    await fillValidAndSubmit(user);

    await waitFor(() => {
      expect(
        screen.getByText("Ese dominio de correo no existe."),
      ).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});

describe("LeadForm — variant prop", () => {
  it("renders without error for test1 variant", () => {
    expect(() =>
      render(<LeadForm variant="test1" onSubmit={mockOnSubmit} />),
    ).not.toThrow();
  });

  it("renders without error for test2 variant", () => {
    expect(() =>
      render(<LeadForm variant="test2" onSubmit={mockOnSubmit} />),
    ).not.toThrow();
  });
});
