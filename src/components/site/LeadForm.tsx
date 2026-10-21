import { useId, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  budgetOptions,
  catalogueOptions,
  isValidEmail,
  isValidPhone,
  occasionOptions,
  quantityOptions,
  selectableValue,
  submitLead,
  type Lead,
  type LeadDelivery,
  type LeadSource,
  type SelectOption,
} from "@/lib/leads";
import { downloadCatalogue } from "@/lib/catalogue-download";
import { BRAND } from "@/data/catalog";
import { useEnquiry } from "./EnquiryProvider";

export interface LeadFormProps {
  source: LeadSource;
  submitLabel?: string | undefined;
  /** Show company + gift-count fields (corporate). */
  corporate?: boolean | undefined;
  /** Show the "I'm looking for" field. */
  showLookingFor?: boolean | undefined;
  defaultQuantity?: string | undefined;
  defaultOccasion?: string | undefined;
  defaultCatalogue?: string | undefined;
  productName?: string | undefined;
  productCode?: string | undefined;
  products?: Array<{ slug: string; name: string; code: string; image?: string }> | undefined;
  compact?: boolean | undefined;
  onSuccess?: (() => void) | undefined;
}

interface FieldErrors {
  firstName?: string;
  phone?: string;
  email?: string;
  catalogueChoice?: string;
}

const labelClass = "eyebrow block mb-2 text-foreground/70";
const controlClass =
  "w-full rounded-sm border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus-visible:outline-none";

export function LeadForm({
  source,
  submitLabel = "Send Enquiry",
  corporate = false,
  showLookingFor = false,
  defaultQuantity,
  defaultOccasion,
  defaultCatalogue,
  productName,
  productCode,
  products,
  compact = false,
  onSuccess,
}: LeadFormProps) {
  const uid = useId();
  const enquiry = useEnquiry();
  const showCatalogueChoice = source === "catalogue";
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [delivery, setDelivery] = useState<LeadDelivery>("confirmed");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [values, setValues] = useState({
    firstName: "",
    phone: "",
    email: "",
    company: "",
    lookingFor: "",
    catalogueChoice: selectableValue(catalogueOptions, defaultCatalogue),
    occasion: selectableValue(occasionOptions, defaultOccasion),
    quantity: defaultQuantity ?? "",
    budget: "",
    eventDate: "",
    message: productName ? `I'm interested in ${productName}.` : "",
    website: "",
  });
  const [openedAt] = useState(() => Date.now());

  const set = (key: keyof typeof values, value: string | boolean) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const next: FieldErrors = {};
    if (!values.firstName.trim()) next.firstName = "Please tell us your name.";
    if (!values.phone.trim()) next.phone = "A mobile number is required.";
    else if (!isValidPhone(values.phone)) next.phone = "Enter a valid mobile number.";
    if (values.email.trim() && !isValidEmail(values.email))
      next.email = "Enter a valid email address.";
    if (showCatalogueChoice && !values.catalogueChoice)
      next.catalogueChoice = "Please choose a catalogue.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "loading") return; // prevents duplicate submissions
    if (!validate()) return;
    // Bots fill the hidden field or submit instantly.
    if (values.website || Date.now() - openedAt < 1500) {
      setStatus("success");
      return;
    }

    setStatus("loading");
    const lead: Lead = {
      source,
      firstName: values.firstName.trim(),
      phone: values.phone.trim(),
      email: values.email.trim() || undefined,
      company: values.company.trim() || undefined,
      lookingFor: values.lookingFor.trim() || undefined,
      catalogueChoice: selectableValue(catalogueOptions, values.catalogueChoice) || undefined,
      occasion: selectableValue(occasionOptions, values.occasion) || undefined,
      quantity: values.quantity || undefined,
      budget: values.budget || undefined,
      eventDate: values.eventDate || undefined,
      message: values.message.trim() || undefined,
      productName: products?.[0]?.name ?? productName,
      productCode: products?.[0]?.code ?? productCode,
      products,
      consent: true,
      website: values.website || undefined,
      submittedAt: new Date().toISOString(),
      pageUrl: typeof window === "undefined" ? "" : window.location.href,
    };

    const result = await submitLead(lead);
    if (result.ok) {
      setDelivery(result.delivery);
      if (source === "catalogue") downloadCatalogue(lead.catalogueChoice);
      if (source === "product-enquiry" && (products?.length ?? 0) > 0) enquiry.clear();
      setStatus("success");
      onSuccess?.();
    } else {
      setStatus("error");
      setErrorMessage(result.error);
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-sm border border-gold/50 bg-card p-8 text-center" role="status">
        <span className="eyebrow text-gold">Received</span>
        <h3 className="display-md mt-3 text-primary">Thank you.</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {delivery === "whatsapp-only"
            ? "Your enquiry is ready in WhatsApp. Please press send there so it reaches us, or call us on "
            : "We've received your gifting requirements and will get back to you soon. You can also reach us on "}
          <a href={BRAND.phoneHref} className="link-underline text-foreground">
            {BRAND.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={status === "loading"} className="space-y-6">
      {/* Spam trap: no label, inert and off-screen via inline style, so it never shows as a field. */}
      <div
        aria-hidden="true"
        inert
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}
      >
        <input
          type="text"
          name="contact_reference"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => set("website", e.target.value)}
        />
      </div>

      <div className={compact ? "space-y-5" : "grid gap-5 sm:grid-cols-2"}>
        <Field
          id={`${uid}-first`}
          label="Your Name *"
          error={errors.firstName}
          value={values.firstName}
          onChange={(v) => set("firstName", v)}
          autoComplete="name"
          required
        />
        <Field
          id={`${uid}-phone`}
          label="Mobile Number *"
          type="tel"
          inputMode="tel"
          error={errors.phone}
          value={values.phone}
          onChange={(v) => set("phone", v)}
          autoComplete="tel"
          placeholder="+91"
          required
        />
        <Field
          id={`${uid}-email`}
          label="Email Address"
          type="email"
          error={errors.email}
          value={values.email}
          onChange={(v) => set("email", v)}
          autoComplete="email"
        />
        {corporate && (
          <Field
            id={`${uid}-company`}
            label="Company Name"
            value={values.company}
            onChange={(v) => set("company", v)}
            autoComplete="organization"
          />
        )}
        {showLookingFor && (
          <Field
            id={`${uid}-looking`}
            label="I'm Looking For"
            value={values.lookingFor}
            onChange={(v) => set("lookingFor", v)}
            placeholder="Return gifts, hampers, corporate gifting…"
          />
        )}
        {showCatalogueChoice && (
          <SelectField
            id={`${uid}-catalogue`}
            label="Choose the Catalogue *"
            value={values.catalogueChoice}
            onChange={(v) => set("catalogueChoice", v)}
            options={catalogueOptions}
            placeholder="Select a catalogue"
            error={errors.catalogueChoice}
          />
        )}

        <SelectField
          id={`${uid}-occasion`}
          label="Occasion"
          value={values.occasion}
          onChange={(v) => set("occasion", v)}
          options={occasionOptions}
          placeholder="Select an occasion"
        />
        <SelectField
          id={`${uid}-quantity`}
          label={corporate ? "Number of Gifts" : "Approximate Quantity"}
          value={values.quantity}
          onChange={(v) => set("quantity", v)}
          options={quantityOptions}
          placeholder="Select a quantity"
        />
        <SelectField
          id={`${uid}-budget`}
          label={corporate ? "Budget per Gift" : "Preferred Budget per Gift"}
          value={values.budget}
          onChange={(v) => set("budget", v)}
          options={budgetOptions}
          placeholder="Select a budget"
        />
        <div>
          <label htmlFor={`${uid}-date`} className={labelClass}>
            Event Date
          </label>
          <input
            id={`${uid}-date`}
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            className={controlClass}
            value={values.eventDate}
            onChange={(e) => set("eventDate", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${uid}-message`} className={labelClass}>
          Message / Requirement
        </label>
        <textarea
          id={`${uid}-message`}
          rows={4}
          className={controlClass}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder={
            productName
              ? `I'm interested in ${productName}.`
              : "Tell us a little about your celebration."
          }
        />
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        We'll use your details only to reply to this enquiry. See our{" "}
        <Link to="/privacy-policy" className="link-underline text-foreground">
          Privacy Policy
        </Link>
        .
      </p>

      {status === "error" && (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-sm bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-all duration-300 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  required = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | undefined;
  type?: string | undefined;
  placeholder?: string | undefined;
  autoComplete?: string | undefined;
  inputMode?: "tel" | "text" | "email" | undefined;
  required?: boolean | undefined;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        aria-invalid={Boolean(error)}
        aria-required={required || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={`${controlClass} ${error ? "border-destructive" : ""}`}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  error?: string | undefined;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={`${controlClass} ${error ? "border-destructive" : ""}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
