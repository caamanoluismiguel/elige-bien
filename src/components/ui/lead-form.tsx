"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { CtaButton } from "./cta-button";
import { EASING } from "@/lib/animation-constants";
import { saveLead, type LeadData } from "@/lib/leads";
import { createLead } from "@/lib/actions/save-lead";
import { getAttribution } from "@/lib/attribution";
import { setLeadId } from "@/lib/lead-session";
import { EXPERIENCE, type GradeValue } from "@/lib/experience-config";

interface LeadFormProps {
  variant: "test1" | "test2";
  onSubmit: (data: LeadData) => void;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASING.EASE_OUT },
  },
};

/**
 * Lead capture form — name + email + WhatsApp + grade + consent.
 *
 * Captures EVERYTHING upfront before the test starts. The lead row is
 * created in Supabase immediately; test results are attached later via
 * updateLeadResults.
 *
 * If the form is bailed mid-test, we still have a complete lead row.
 */
export function LeadForm({ variant, onSubmit }: LeadFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [grade, setGrade] = useState<GradeValue | "">("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    whatsapp?: string;
    grade?: string;
    consent?: string;
    server?: string;
  }>({});
  const [pending, startTransition] = useTransition();

  const { gate2 } = EXPERIENCE;
  const isTest1 = variant === "test1";
  const accent = isTest1 ? "#00FF66" : "#FF6B35";
  const bgColor = isTest1 ? "#0A0A0A" : "#0D0B09";
  const textColor = isTest1 ? "#F5F5F5" : "#F5F0EB";
  const mutedColor = isTest1 ? "#A0A0A0" : "#A09688";
  const borderColor = isTest1 ? "#1A1A1A" : "#332E26";
  const focusBorder = isTest1 ? "#00FF6666" : "#FF6B3566";

  const clearError = (key: keyof typeof errors) => {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    const trimmedName = name.trim();
    if (!trimmedName) newErrors.name = "Escribe tu nombre";
    else if (trimmedName.length < 2) newErrors.name = "Nombre muy corto";

    const trimmedEmail = email.trim();
    if (!trimmedEmail) newErrors.email = "Escribe tu correo";
    else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail))
      newErrors.email = "Correo inválido";

    const cleanNumber = whatsapp.replace(/\D/g, "");
    if (!cleanNumber) newErrors.whatsapp = "Escribe tu WhatsApp";
    else if (cleanNumber.length < 10) newErrors.whatsapp = "Número incompleto";

    if (!grade) newErrors.grade = "Selecciona tu grado";

    if (!consent) newErrors.consent = "Tienes que aceptar para continuar";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) return;
    if (pending) return;

    startTransition(async () => {
      const result = await createLead({
        name: name.trim(),
        email: email.trim(),
        phone: whatsapp,
        grade: grade as GradeValue,
        consentMarketing: consent,
        attribution: getAttribution(),
      });

      if (!result.success) {
        setErrors((prev) => ({ ...prev, server: result.error }));
        return;
      }

      // Normalize the phone for local cache (+52 prefix)
      const data: LeadData = {
        name: name.trim(),
        whatsapp: whatsapp.replace(/\D/g, ""),
        email: email.trim().toLowerCase(),
        grade: grade as GradeValue,
      };
      saveLead(data);
      setLeadId(result.data.leadId);
      onSubmit(data);
    });
  };

  const inputBaseStyle = (hasError: boolean) => ({
    backgroundColor: `${accent}08`,
    border: `1.5px solid ${hasError ? "#FF4444" : borderColor}`,
    color: textColor,
    outlineColor: `${accent}99`,
  });

  const inputClass =
    "w-full h-[52px] lg:h-[56px] px-4 rounded-xl font-[family-name:var(--font-inter)] text-[16px] lg:text-[18px] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 transition-[border-color] duration-150";

  return (
    <motion.div
      className="relative min-h-dvh flex flex-col px-6 pb-[34px] lg:max-w-md lg:mx-auto"
      style={{ backgroundColor: bgColor }}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3, ease: EASING.EASE_OUT }}
    >
      {/* Decorative neon accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full w-1/3 mx-auto rounded-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}40, transparent)`,
          }}
        />
      </div>

      <div className="pt-[calc(env(safe-area-inset-top,47px)+48px)]" />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col flex-1">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col"
        >
          {/* Heading */}
          <motion.h2
            variants={itemVariants}
            className="font-[family-name:var(--font-space-grotesk)] text-[28px] font-bold leading-[1.1] tracking-[-0.02em]"
            style={{ color: textColor }}
          >
            Antes de empezar
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-2 font-[family-name:var(--font-inter)] text-[15px] leading-[1.5]"
            style={{ color: mutedColor }}
          >
            Para mandarte tu perfil y que no lo pierdas.
          </motion.p>

          <div className="h-6" />

          {/* Name */}
          <motion.div variants={itemVariants}>
            <label
              htmlFor="lead-name"
              className="block font-[family-name:var(--font-inter)] text-[13px] font-medium mb-1.5"
              style={{ color: mutedColor }}
            >
              Tu nombre
            </label>
            <input
              id="lead-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearError("name");
              }}
              placeholder="Nombre y apellido"
              autoComplete="name"
              aria-required="true"
              aria-invalid={errors.name ? "true" : undefined}
              aria-describedby={errors.name ? "lead-name-error" : undefined}
              className={inputClass}
              style={inputBaseStyle(!!errors.name)}
              onFocus={(e) => {
                if (!errors.name)
                  e.currentTarget.style.borderColor = focusBorder;
              }}
              onBlur={(e) => {
                if (!errors.name)
                  e.currentTarget.style.borderColor = borderColor;
              }}
            />
            {errors.name && (
              <p
                id="lead-name-error"
                role="alert"
                className="mt-1 text-[12px] font-[family-name:var(--font-inter)] text-[#FF4444]"
              >
                {errors.name}
              </p>
            )}
          </motion.div>

          <div className="h-4" />

          {/* Email */}
          <motion.div variants={itemVariants}>
            <label
              htmlFor="lead-email"
              className="block font-[family-name:var(--font-inter)] text-[13px] font-medium mb-1.5"
              style={{ color: mutedColor }}
            >
              Tu correo
            </label>
            <input
              id="lead-email"
              type="email"
              inputMode="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError("email");
                clearError("server");
              }}
              placeholder="tunombre@mail.com"
              autoComplete="email"
              aria-required="true"
              aria-invalid={errors.email ? "true" : undefined}
              aria-describedby={errors.email ? "lead-email-error" : undefined}
              className={inputClass}
              style={inputBaseStyle(!!errors.email)}
              onFocus={(e) => {
                if (!errors.email)
                  e.currentTarget.style.borderColor = focusBorder;
              }}
              onBlur={(e) => {
                if (!errors.email)
                  e.currentTarget.style.borderColor = borderColor;
              }}
            />
            {errors.email && (
              <p
                id="lead-email-error"
                role="alert"
                className="mt-1 text-[12px] font-[family-name:var(--font-inter)] text-[#FF4444]"
              >
                {errors.email}
              </p>
            )}
          </motion.div>

          <div className="h-4" />

          {/* WhatsApp */}
          <motion.div variants={itemVariants}>
            <label
              htmlFor="lead-whatsapp"
              className="block font-[family-name:var(--font-inter)] text-[13px] font-medium mb-1.5"
              style={{ color: mutedColor }}
            >
              Tu WhatsApp
            </label>
            <div className="relative flex">
              <div
                className="flex items-center gap-1.5 px-3 h-[52px] lg:h-[56px] rounded-l-xl shrink-0"
                style={{
                  backgroundColor: `${accent}10`,
                  border: `1.5px solid ${errors.whatsapp ? "#FF4444" : borderColor}`,
                  borderRight: "none",
                }}
                aria-hidden="true"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 18 18"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M9 1.5C4.86 1.5 1.5 4.86 1.5 9c0 1.32.35 2.56.96 3.63L1.5 16.5l3.98-.95A7.46 7.46 0 009 16.5c4.14 0 7.5-3.36 7.5-7.5S13.14 1.5 9 1.5z"
                    stroke="#25D366"
                    strokeWidth="1.2"
                    fill="none"
                  />
                </svg>
                <span
                  className="font-[family-name:var(--font-inter)] text-[14px] font-medium"
                  style={{ color: mutedColor }}
                >
                  +52
                </span>
              </div>
              <input
                id="lead-whatsapp"
                type="tel"
                inputMode="numeric"
                value={whatsapp}
                onChange={(e) => {
                  setWhatsapp(e.target.value);
                  clearError("whatsapp");
                }}
                placeholder="614 123 4567"
                autoComplete="tel"
                aria-required="true"
                aria-invalid={errors.whatsapp ? "true" : undefined}
                aria-describedby={
                  errors.whatsapp ? "lead-whatsapp-error" : undefined
                }
                className="w-full h-[52px] lg:h-[56px] px-4 rounded-r-xl font-[family-name:var(--font-inter)] text-[16px] lg:text-[18px] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 transition-[border-color] duration-150"
                style={{
                  backgroundColor: `${accent}08`,
                  border: `1.5px solid ${errors.whatsapp ? "#FF4444" : borderColor}`,
                  borderLeft: "none",
                  color: textColor,
                  outlineColor: `${accent}99`,
                }}
                onFocus={(e) => {
                  if (!errors.whatsapp)
                    e.currentTarget.style.borderColor = focusBorder;
                }}
                onBlur={(e) => {
                  if (!errors.whatsapp)
                    e.currentTarget.style.borderColor = borderColor;
                }}
              />
            </div>
            {errors.whatsapp && (
              <p
                id="lead-whatsapp-error"
                role="alert"
                className="mt-1 text-[12px] font-[family-name:var(--font-inter)] text-[#FF4444]"
              >
                {errors.whatsapp}
              </p>
            )}
          </motion.div>

          <div className="h-4" />

          {/* Grade */}
          <motion.div variants={itemVariants}>
            <label
              htmlFor="lead-grade"
              className="block font-[family-name:var(--font-inter)] text-[13px] font-medium mb-1.5"
              style={{ color: mutedColor }}
            >
              En qué grado vas
            </label>
            <select
              id="lead-grade"
              value={grade}
              onChange={(e) => {
                setGrade(e.target.value as GradeValue);
                clearError("grade");
              }}
              aria-required="true"
              aria-invalid={errors.grade ? "true" : undefined}
              aria-describedby={errors.grade ? "lead-grade-error" : undefined}
              className={inputClass}
              style={inputBaseStyle(!!errors.grade)}
              onFocus={(e) => {
                if (!errors.grade)
                  e.currentTarget.style.borderColor = focusBorder;
              }}
              onBlur={(e) => {
                if (!errors.grade)
                  e.currentTarget.style.borderColor = borderColor;
              }}
            >
              <option value="" disabled>
                Selecciona
              </option>
              {gate2.fields.grade.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.grade && (
              <p
                id="lead-grade-error"
                role="alert"
                className="mt-1 text-[12px] font-[family-name:var(--font-inter)] text-[#FF4444]"
              >
                {errors.grade}
              </p>
            )}
          </motion.div>

          <div className="h-5" />

          {/* Consent */}
          <motion.div variants={itemVariants}>
            <label className="flex items-start gap-3 cursor-pointer min-h-11 py-1">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  clearError("consent");
                }}
                className="mt-1 w-4 h-4 accent-current cursor-pointer shrink-0"
                style={{ accentColor: accent }}
                aria-invalid={errors.consent ? "true" : undefined}
                aria-describedby={
                  errors.consent ? "lead-consent-error" : undefined
                }
              />
              <span
                className="font-[family-name:var(--font-inter)] text-[12px] leading-[1.5]"
                style={{ color: mutedColor }}
              >
                {gate2.consent.label}
              </span>
            </label>
            {errors.consent && (
              <p
                id="lead-consent-error"
                role="alert"
                className="mt-1 text-[12px] font-[family-name:var(--font-inter)] text-[#FF4444]"
              >
                {errors.consent}
              </p>
            )}
          </motion.div>

          {errors.server && (
            <div
              role="alert"
              className="mt-4 px-4 py-3 rounded-xl font-[family-name:var(--font-inter)] text-[13px]"
              style={{
                backgroundColor: "#FF444414",
                border: "1px solid #FF444433",
                color: "#FF6B6B",
              }}
            >
              {errors.server}
            </div>
          )}
        </motion.div>

        <div className="flex-1 min-h-8" />

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.55, ease: EASING.EASE_OUT }}
        >
          <CtaButton variant={variant} disabled={pending}>
            {pending ? "Guardando..." : "Empezar"}
          </CtaButton>
        </motion.div>
      </form>

      <div className="h-4" />

      {/* Privacy note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.75 }}
        className="text-center font-[family-name:var(--font-inter)] text-[12px]"
        style={{ color: `${mutedColor}99` }}
      >
        No compartimos tu info con nadie. Cero spam.
      </motion.p>

      <div className="pb-[env(safe-area-inset-bottom,34px)]" />
    </motion.div>
  );
}
