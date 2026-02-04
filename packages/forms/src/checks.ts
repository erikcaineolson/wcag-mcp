import type { CheckResult } from "@wcag-mcp/core";

// =============================================================================
// Types
// =============================================================================

export interface FormFieldInput {
  /** Field type */
  fieldType: "text" | "email" | "password" | "tel" | "url" | "number" | "date" | "select" | "checkbox" | "radio" | "textarea" | "file" | "other";
  /** Whether field has a visible label */
  hasVisibleLabel: boolean;
  /** Whether field has an accessible label (aria-label, aria-labelledby, or associated label) */
  hasAccessibleLabel: boolean;
  /** Label text content */
  labelText?: string;
  /** Whether field has placeholder */
  hasPlaceholder?: boolean;
  /** Placeholder text */
  placeholderText?: string;
  /** Whether placeholder is used as only label */
  placeholderAsLabel?: boolean;
  /** Whether field has instructions */
  hasInstructions?: boolean;
  /** Whether field is required */
  isRequired?: boolean;
  /** Whether required is indicated visually */
  requiredIndicatedVisually?: boolean;
  /** Whether required is indicated programmatically */
  requiredIndicatedProgrammatically?: boolean;
  /** autocomplete attribute value */
  autocomplete?: string;
  /** Input purpose (for 1.3.5) */
  inputPurpose?: string;
}

export interface FormErrorInput {
  /** Whether form has validation errors */
  hasErrors: boolean;
  /** Whether errors are identified in text */
  errorsInText?: boolean;
  /** Whether error field is identified */
  errorFieldIdentified?: boolean;
  /** Whether error is described */
  errorDescribed?: boolean;
  /** Whether suggestions are provided */
  hasSuggestions?: boolean;
  /** Whether error is announced to screen readers */
  errorAnnounced?: boolean;
  /** Whether focus moves to error */
  focusMovesToError?: boolean;
  /** Error message text */
  errorMessage?: string;
}

export interface FormSubmissionInput {
  /** Type of transaction */
  transactionType: "legal" | "financial" | "data-modification" | "test" | "other";
  /** Whether submission is reversible */
  isReversible?: boolean;
  /** Whether data is checked before submission */
  dataIsChecked?: boolean;
  /** Whether user can review before submission */
  canReview?: boolean;
  /** Whether confirmation is required */
  requiresConfirmation?: boolean;
}

export interface InputConstraintInput {
  /** Field identifier */
  fieldName: string;
  /** Whether field has format requirements */
  hasFormatRequirements: boolean;
  /** Whether format is explained */
  formatExplained?: boolean;
  /** Example format provided */
  exampleProvided?: boolean;
  /** Whether real-time validation is provided */
  hasRealtimeValidation?: boolean;
  /** Whether input is constrained (pattern, min/max, etc.) */
  hasInputConstraints?: boolean;
  /** Constraint description */
  constraintDescription?: string;
}

// =============================================================================
// Autocomplete token mapping for 1.3.5
// =============================================================================

const VALID_AUTOCOMPLETE_TOKENS: Record<string, string> = {
  "name": "Full name",
  "honorific-prefix": "Prefix (Mr., Ms., Dr.)",
  "given-name": "First name",
  "additional-name": "Middle name",
  "family-name": "Last name",
  "honorific-suffix": "Suffix (Jr., III)",
  "nickname": "Nickname",
  "email": "Email address",
  "username": "Username",
  "new-password": "New password",
  "current-password": "Current password",
  "one-time-code": "One-time code (OTP)",
  "organization-title": "Job title",
  "organization": "Organization name",
  "street-address": "Street address",
  "address-line1": "Address line 1",
  "address-line2": "Address line 2",
  "address-line3": "Address line 3",
  "address-level4": "Address level 4",
  "address-level3": "Address level 3",
  "address-level2": "City",
  "address-level1": "State/Province",
  "country": "Country code",
  "country-name": "Country name",
  "postal-code": "Postal/ZIP code",
  "cc-name": "Cardholder name",
  "cc-given-name": "Cardholder first name",
  "cc-additional-name": "Cardholder middle name",
  "cc-family-name": "Cardholder last name",
  "cc-number": "Credit card number",
  "cc-exp": "Card expiration date",
  "cc-exp-month": "Card expiration month",
  "cc-exp-year": "Card expiration year",
  "cc-csc": "Card security code",
  "cc-type": "Card type",
  "transaction-currency": "Transaction currency",
  "transaction-amount": "Transaction amount",
  "language": "Preferred language",
  "bday": "Birthday",
  "bday-day": "Birthday day",
  "bday-month": "Birthday month",
  "bday-year": "Birthday year",
  "sex": "Sex/Gender",
  "tel": "Full telephone number",
  "tel-country-code": "Country code",
  "tel-national": "National telephone number",
  "tel-area-code": "Area code",
  "tel-local": "Local telephone number",
  "tel-extension": "Phone extension",
  "impp": "IM protocol endpoint",
  "url": "Website URL",
  "photo": "Photo URL",
};

// =============================================================================
// Check Functions
// =============================================================================

export function checkFormLabels(input: FormFieldInput): CheckResult[] {
  const results: CheckResult[] = [];

  // 3.3.2 Labels or Instructions (Level A)
  const hasLabel = input.hasVisibleLabel || input.hasAccessibleLabel;

  if (!hasLabel) {
    results.push({
      criterion: "3.3.2",
      name: "Labels or Instructions",
      level: "A",
      status: "fail",
      message: `${input.fieldType} field lacks label`,
      recommendation: "Add a visible label associated with the form field using <label> element or aria-labelledby",
    });
  } else {
    results.push({
      criterion: "3.3.2",
      name: "Labels or Instructions",
      level: "A",
      status: "pass",
      value: input.labelText || "(accessible label provided)",
      message: `${input.fieldType} field has ${input.hasVisibleLabel ? "visible" : "accessible"} label`,
    });
  }

  // Check placeholder-as-label anti-pattern
  if (input.placeholderAsLabel) {
    results.push({
      criterion: "3.3.2",
      name: "Labels or Instructions",
      level: "A",
      status: "fail",
      message: "Placeholder text used as only label",
      recommendation: "Placeholders disappear on input; use persistent visible labels instead",
    });
  }

  // Check visible vs accessible label consistency
  if (input.hasVisibleLabel && !input.hasAccessibleLabel) {
    results.push({
      criterion: "3.3.2",
      name: "Labels or Instructions",
      level: "A",
      status: "warning",
      message: "Visible label may not be programmatically associated",
      recommendation: "Use <label for=\"id\">, aria-labelledby, or wrap input in label element",
    });
  }

  // Check required field indication
  if (input.isRequired) {
    if (!input.requiredIndicatedVisually) {
      results.push({
        criterion: "3.3.2",
        name: "Labels or Instructions",
        level: "A",
        status: "warning",
        message: "Required field not indicated visually",
        recommendation: "Add visual indicator (asterisk, 'required' text) for required fields",
      });
    }
    if (!input.requiredIndicatedProgrammatically) {
      results.push({
        criterion: "3.3.2",
        name: "Labels or Instructions",
        level: "A",
        status: "fail",
        message: "Required field not indicated programmatically",
        recommendation: "Add required attribute or aria-required=\"true\"",
      });
    }
  }

  return results;
}

export function checkInputPurpose(input: FormFieldInput): CheckResult[] {
  const results: CheckResult[] = [];

  // 1.3.5 Identify Input Purpose (Level AA)
  // Only applies to fields collecting user information

  const userInfoFields = ["name", "email", "tel", "password", "address", "cc", "bday"];
  const isUserInfoField = userInfoFields.some(f =>
    input.fieldType.includes(f) ||
    (input.inputPurpose && input.inputPurpose.includes(f))
  );

  if (!isUserInfoField && !input.autocomplete) {
    // Not applicable
    return results;
  }

  if (input.autocomplete) {
    const token = input.autocomplete.split(" ").pop() || "";
    const isValidToken = VALID_AUTOCOMPLETE_TOKENS[token] !== undefined;

    results.push({
      criterion: "1.3.5",
      name: "Identify Input Purpose",
      level: "AA",
      status: isValidToken ? "pass" : "warning",
      value: input.autocomplete,
      message: isValidToken
        ? `Input purpose identified: ${VALID_AUTOCOMPLETE_TOKENS[token]} (autocomplete="${input.autocomplete}")`
        : `Autocomplete value "${input.autocomplete}" may not be a standard token`,
      recommendation: isValidToken
        ? undefined
        : "Use standard autocomplete tokens from HTML specification",
    });
  } else if (isUserInfoField) {
    results.push({
      criterion: "1.3.5",
      name: "Identify Input Purpose",
      level: "AA",
      status: "warning",
      message: `${input.fieldType} field collecting user info should have autocomplete attribute`,
      recommendation: "Add appropriate autocomplete attribute (e.g., autocomplete=\"email\")",
    });
  }

  return results;
}

export function checkErrorIdentification(input: FormErrorInput): CheckResult[] {
  const results: CheckResult[] = [];

  if (!input.hasErrors) {
    return [{
      criterion: "3.3.1",
      name: "Error Identification",
      level: "A",
      status: "info",
      message: "No form errors to validate",
    }];
  }

  // 3.3.1 Error Identification (Level A)
  const identifiedInText = input.errorsInText && input.errorFieldIdentified;

  results.push({
    criterion: "3.3.1",
    name: "Error Identification",
    level: "A",
    status: identifiedInText ? "pass" : "fail",
    value: identifiedInText,
    message: identifiedInText
      ? "Input error is identified and described in text"
      : "Input error not properly identified in text",
    recommendation: identifiedInText
      ? undefined
      : "Identify the field with error and describe the error in text (not just color/icon)",
  });

  // Check if error is described
  if (!input.errorDescribed) {
    results.push({
      criterion: "3.3.1",
      name: "Error Identification",
      level: "A",
      status: "warning",
      message: "Error may not be clearly described",
      recommendation: "Provide clear description of what went wrong",
    });
  }

  // 3.3.3 Error Suggestion (Level AA)
  if (input.errorsInText) {
    results.push({
      criterion: "3.3.3",
      name: "Error Suggestion",
      level: "AA",
      status: input.hasSuggestions ? "pass" : "fail",
      value: input.hasSuggestions,
      message: input.hasSuggestions
        ? "Suggestions provided for correcting the error"
        : "No suggestions provided for correcting the error",
      recommendation: input.hasSuggestions
        ? undefined
        : "Provide suggestions for fixing the error (unless it would compromise security)",
    });
  }

  // Check accessibility of error message
  if (!input.errorAnnounced) {
    results.push({
      criterion: "3.3.1",
      name: "Error Identification",
      level: "A",
      status: "warning",
      message: "Error may not be announced to screen readers",
      recommendation: "Use aria-live region, role=\"alert\", or aria-describedby to announce errors",
    });
  }

  return results;
}

export function checkErrorPrevention(input: FormSubmissionInput): CheckResult[] {
  const results: CheckResult[] = [];

  const isHighStakes = ["legal", "financial", "data-modification"].includes(input.transactionType);

  if (!isHighStakes) {
    return [{
      criterion: "3.3.4",
      name: "Error Prevention (Legal, Financial, Data)",
      level: "AA",
      status: "info",
      message: `Transaction type "${input.transactionType}" may not require error prevention measures`,
    }];
  }

  // 3.3.4 Error Prevention (Legal, Financial, Data) - Level AA
  const hasPrevention = input.isReversible || input.dataIsChecked || input.canReview || input.requiresConfirmation;

  const preventionMethods = [
    input.isReversible && "reversible",
    input.dataIsChecked && "checked for errors",
    input.canReview && "review before submission",
    input.requiresConfirmation && "confirmation required",
  ].filter(Boolean);

  results.push({
    criterion: "3.3.4",
    name: "Error Prevention (Legal, Financial, Data)",
    level: "AA",
    status: hasPrevention ? "pass" : "fail",
    value: hasPrevention,
    message: hasPrevention
      ? `Error prevention: ${preventionMethods.join(", ")}`
      : `${input.transactionType} transaction lacks error prevention mechanism`,
    recommendation: hasPrevention
      ? undefined
      : "Provide at least one: reversibility, error checking, review opportunity, or confirmation",
  });

  // 3.3.6 Error Prevention (All) - Level AAA
  results.push({
    criterion: "3.3.6",
    name: "Error Prevention (All)",
    level: "AAA",
    status: hasPrevention ? "pass" : "warning",
    message: hasPrevention
      ? "Form submission has error prevention (meets AAA for all submissions)"
      : "Consider adding error prevention for all form submissions (AAA)",
    recommendation: hasPrevention
      ? undefined
      : "For AAA, all submissions should be reversible, checked, or confirmed",
  });

  return results;
}

export function checkInputConstraints(input: InputConstraintInput): CheckResult[] {
  const results: CheckResult[] = [];

  if (!input.hasFormatRequirements) {
    return [];
  }

  // 3.3.2 Labels or Instructions - format requirements
  const hasInstructions = input.formatExplained || input.exampleProvided;

  results.push({
    criterion: "3.3.2",
    name: "Labels or Instructions",
    level: "A",
    status: hasInstructions ? "pass" : "fail",
    value: hasInstructions,
    message: hasInstructions
      ? `Format requirements for ${input.fieldName}: ${[
          input.formatExplained && "explained",
          input.exampleProvided && "example provided",
        ].filter(Boolean).join(", ")}`
      : `${input.fieldName} has format requirements but no instructions`,
    recommendation: hasInstructions
      ? undefined
      : "Explain required format and provide examples (e.g., 'MM/DD/YYYY')",
  });

  // 3.3.5 Help (Level AAA)
  const hasHelp = hasInstructions && input.hasRealtimeValidation;
  results.push({
    criterion: "3.3.5",
    name: "Help",
    level: "AAA",
    status: hasHelp ? "pass" : "warning",
    message: hasHelp
      ? "Context-sensitive help is available"
      : "Consider providing context-sensitive help for complex inputs",
    recommendation: hasHelp
      ? undefined
      : "Provide inline help, tooltips, or real-time validation feedback",
  });

  return results;
}

export function checkOnInput(input: {
  elementType: string;
  changesContextOnInput: boolean;
  userWarned?: boolean;
}): CheckResult[] {
  const results: CheckResult[] = [];

  // 3.2.2 On Input (Level A)
  if (!input.changesContextOnInput) {
    results.push({
      criterion: "3.2.2",
      name: "On Input",
      level: "A",
      status: "pass",
      message: `${input.elementType} does not change context on input`,
    });
    return results;
  }

  results.push({
    criterion: "3.2.2",
    name: "On Input",
    level: "A",
    status: input.userWarned ? "pass" : "fail",
    value: input.userWarned,
    message: input.userWarned
      ? `${input.elementType} changes context but user is warned in advance`
      : `${input.elementType} changes context unexpectedly on input`,
    recommendation: input.userWarned
      ? undefined
      : "Either prevent context change on input, or warn user beforehand",
  });

  return results;
}

export function validateForm(fields: FormFieldInput[], errors?: FormErrorInput): CheckResult[] {
  const results: CheckResult[] = [];

  for (const field of fields) {
    results.push(...checkFormLabels(field));
    results.push(...checkInputPurpose(field));
  }

  if (errors) {
    results.push(...checkErrorIdentification(errors));
  }

  return results;
}
