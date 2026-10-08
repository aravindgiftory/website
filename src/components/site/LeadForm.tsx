import { useId, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  budgetOptions,
  catalogueComingSoonNote,
  catalogueOptions,
  isComingSoon,
  isValidEmail,
  isValidPhone,
  occasionOptions,
  optionLabel,
  quantityOptions,
  selectableValue,
  submitLead,
  type Lead,
  type LeadSource,
  type SelectOption,
} from "@/lib/leads";
import { downloadCatalogue } from "@/lib/catalogue-download";
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
  lookingFor?: string;
  catalogueChoice?: string;
  quantity?: string;
  consent?: string;
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
  const [errors, setErrors] = useState<FieldErrors>({});
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    company: "",
    lookingFor: "",
    catalogueChoice: selectableValue(catalogueOptions, defaultCatalogue),
    occasion: selectableValue(occasionOptions, defaultOccasion),
    quantity: defaultQuantity ?? "",
    budget: "",
    eventDate: "",
    message: "",
    consent: false,
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
    if (showLookingFor && !values.lookingFor.trim())
      next.lookingFor = "Let us know what you're looking for.";
    if (showCatalogueChoice && !values.catalogueChoice)
      next.catalogueChoice = "Please choose a catalogue.";
    if (showLookingFor && !values.quantity)
      next.quantity = "Approximate quantity helps us help you.";
    if (!values.consent) next.consent = "Please confirm we may contact you.";
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
      lastName: values.lastName.trim() || undefined,
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
      consent: values.consent,
      website: values.website || undefined,
      submittedAt: new Date().toISOString(),
      pageUrl: typeof window === "undefined" ? "" : window.location.href,
    };

    const result = await submitLead(lead);
    if (result.ok) {
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
          We've received your gifting requirements. An Aravind Giftory representative may contact
          you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input
          id={`${uid}-website`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => set("website", e.target.value)}
        />
      </div>

      <div className={compact ? "space-y-5" : "grid gap-5 sm:grid-cols-2"}>
        <Field
          id={`${uid}-first`}
          label="First Name *"
          error={errors.firstName}
          value={values.firstName}
          onChange={(v) => set("firstName", v)}
          autoComplete="given-name"
        />
        <Field
          id={`${uid}-last`}
          label="Last Name"
          value={values.lastName}
          onChange={(v) => set("lastName", v)}
          autoComplete="family-name"
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
            label="I'm Looking For *"
            error={errors.lookingFor}
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
            comingSoonNote={catalogueComingSoonNote}
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
          label={corporate ? "Number of Gifts" : "Approximate Quantity *"}
          value={values.quantity}
          onChange={(v) => set("quantity", v)}
          options={quantityOptions}
          placeholder="Select a quantity"
          error={errors.quantity}
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

      <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted-foreground">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-[oklch(0.318_0.083_27)]"
          checked={values.consent}
          onChange={(e) => set("consent", e.target.checked)}
        />
        <span>
          I'd like Aravind Giftory to contact me regarding my gifting requirements, and I agree to
          the{" "}
          <Link to="/privacy-policy" className="link-underline text-foreground">
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      {errors.consent && (
        <p className="text-xs text-destructive" role="alert">
          {errors.consent}
        </p>
      )}

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
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={`${controlClass} ${error ? "border-destructive" : ""}`}
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-xs text-destructive">
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
  comingSoonNote,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  error?: string | undefined;
  comingSoonNote?: string | undefined;
}) {
  const comingSoonLabels = options.filter(isComingSoon).map(optionLabel);
  const note =
    comingSoonNote ??
    (comingSoonLabels.length > 0 ? `${comingSoonLabels.join(" & ")} — Coming Soon` : undefined);

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
        {options.map((option) => {
          const label = optionLabel(option);
          const comingSoon = isComingSoon(option);
          return (
            <option key={label} value={comingSoon ? "" : label} disabled={comingSoon}>
              {comingSoon ? `${label} — Coming Soon` : label}
            </option>
          );
        })}
      </select>
      {note && (
        <span className="mt-2 inline-flex items-center rounded-full border border-gold/50 bg-gold/10 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-gold">
          {note}
        </span>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
