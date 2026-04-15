import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  saveLead,
  getSavedLead,
  clearSavedLead,
  type LeadData,
} from "@/lib/leads";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
  };
})();

beforeEach(() => {
  Object.defineProperty(globalThis, "localStorage", {
    value: localStorageMock,
    writable: true,
    configurable: true,
  });
  localStorageMock.clear();
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

const VALID_LEAD: LeadData = {
  name: "Maria",
  whatsapp: "6141234567",
  email: "maria@example.com",
  grade: "prepa_3",
};

describe("saveLead", () => {
  it("persists lead data as JSON under the correct key", () => {
    saveLead(VALID_LEAD);

    expect(localStorageMock.setItem).toHaveBeenCalledOnce();
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "isthmus-lead",
      JSON.stringify(VALID_LEAD),
    );
  });

  it("does not throw when localStorage is unavailable", () => {
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new DOMException("QuotaExceededError");
    });
    expect(() => saveLead(VALID_LEAD)).not.toThrow();
  });

  it("overwrites previous lead data", () => {
    saveLead(VALID_LEAD);
    const second: LeadData = {
      name: "Second",
      whatsapp: "2222222222",
      email: "second@example.com",
      grade: "prepa_1_2",
    };
    saveLead(second);

    expect(localStorageMock.setItem).toHaveBeenCalledTimes(2);
    const lastCall = localStorageMock.setItem.mock.calls[1];
    expect(JSON.parse(lastCall[1])).toEqual(second);
  });
});

describe("getSavedLead", () => {
  it("returns null when no lead is saved", () => {
    expect(getSavedLead()).toBeNull();
  });

  it("returns the saved lead data when complete", () => {
    localStorageMock.setItem("isthmus-lead", JSON.stringify(VALID_LEAD));
    localStorageMock.getItem.mockClear();

    const result = getSavedLead();
    expect(result).toEqual(VALID_LEAD);
    expect(localStorageMock.getItem).toHaveBeenCalledWith("isthmus-lead");
  });

  it("returns null when stored JSON is malformed", () => {
    localStorageMock.getItem.mockReturnValueOnce("{not valid json");
    expect(getSavedLead()).toBeNull();
  });

  it("returns null when missing name", () => {
    const { name: _name, ...rest } = VALID_LEAD;
    void _name;
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(rest));
    expect(getSavedLead()).toBeNull();
  });

  it("returns null when missing whatsapp", () => {
    const { whatsapp: _wa, ...rest } = VALID_LEAD;
    void _wa;
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(rest));
    expect(getSavedLead()).toBeNull();
  });

  it("returns null when missing email", () => {
    const { email: _em, ...rest } = VALID_LEAD;
    void _em;
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(rest));
    expect(getSavedLead()).toBeNull();
  });

  it("returns null when missing grade", () => {
    const { grade: _gr, ...rest } = VALID_LEAD;
    void _gr;
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(rest));
    expect(getSavedLead()).toBeNull();
  });

  it("returns null when stored data has empty name", () => {
    localStorageMock.getItem.mockReturnValueOnce(
      JSON.stringify({ ...VALID_LEAD, name: "" }),
    );
    expect(getSavedLead()).toBeNull();
  });

  it("does not throw when localStorage throws", () => {
    localStorageMock.getItem.mockImplementationOnce(() => {
      throw new Error("SecurityError");
    });
    expect(() => getSavedLead()).not.toThrow();
    expect(getSavedLead()).toBeNull();
  });
});

describe("clearSavedLead", () => {
  it("removes the stored lead", () => {
    saveLead(VALID_LEAD);
    clearSavedLead();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("isthmus-lead");
  });

  it("does not throw when localStorage throws", () => {
    localStorageMock.removeItem.mockImplementationOnce(() => {
      throw new Error("SecurityError");
    });
    expect(() => clearSavedLead()).not.toThrow();
  });
});
