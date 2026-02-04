import type { ToolDefinition } from "@wcag-mcp/core";

export const FORMS_TOOLS: ToolDefinition[] = [
  {
    name: "check_form_labels",
    description: "Check WCAG 3.3.2 Labels or Instructions. Validates form fields have proper labels and instructions.",
    inputSchema: {
      type: "object",
      properties: {
        fieldType: {
          type: "string",
          enum: ["text", "email", "password", "tel", "url", "number", "date", "select", "checkbox", "radio", "textarea", "file", "other"],
          description: "Type of form field",
        },
        hasVisibleLabel: { type: "boolean", description: "Whether field has a visible label" },
        hasAccessibleLabel: { type: "boolean", description: "Whether field has an accessible label" },
        labelText: { type: "string", description: "Label text content" },
        hasPlaceholder: { type: "boolean", description: "Whether field has placeholder" },
        placeholderText: { type: "string", description: "Placeholder text" },
        placeholderAsLabel: { type: "boolean", description: "Whether placeholder is used as only label" },
        hasInstructions: { type: "boolean", description: "Whether field has instructions" },
        isRequired: { type: "boolean", description: "Whether field is required" },
        requiredIndicatedVisually: { type: "boolean", description: "Whether required is shown visually" },
        requiredIndicatedProgrammatically: { type: "boolean", description: "Whether required is in code" },
      },
      required: ["fieldType", "hasVisibleLabel", "hasAccessibleLabel"],
    },
  },
  {
    name: "check_input_purpose",
    description: "Check WCAG 1.3.5 Identify Input Purpose. Validates autocomplete attributes for user info fields.",
    inputSchema: {
      type: "object",
      properties: {
        fieldType: {
          type: "string",
          enum: ["text", "email", "password", "tel", "url", "number", "date", "select", "checkbox", "radio", "textarea", "file", "other"],
          description: "Type of form field",
        },
        autocomplete: { type: "string", description: "autocomplete attribute value" },
        inputPurpose: { type: "string", description: "Purpose of the input (name, email, etc.)" },
        hasVisibleLabel: { type: "boolean", description: "Whether field has a visible label" },
        hasAccessibleLabel: { type: "boolean", description: "Whether field has an accessible label" },
      },
      required: ["fieldType"],
    },
  },
  {
    name: "check_error_identification",
    description: "Check WCAG 3.3.1 Error Identification and 3.3.3 Error Suggestion. Validates form errors are properly communicated.",
    inputSchema: {
      type: "object",
      properties: {
        hasErrors: { type: "boolean", description: "Whether form has validation errors" },
        errorsInText: { type: "boolean", description: "Whether errors are identified in text" },
        errorFieldIdentified: { type: "boolean", description: "Whether error field is identified" },
        errorDescribed: { type: "boolean", description: "Whether error is described" },
        hasSuggestions: { type: "boolean", description: "Whether suggestions are provided" },
        errorAnnounced: { type: "boolean", description: "Whether error is announced to screen readers" },
        focusMovesToError: { type: "boolean", description: "Whether focus moves to error" },
        errorMessage: { type: "string", description: "Error message text" },
      },
      required: ["hasErrors"],
    },
  },
  {
    name: "check_error_prevention",
    description: "Check WCAG 3.3.4 and 3.3.6 Error Prevention. Validates submissions can be reversed, checked, or confirmed.",
    inputSchema: {
      type: "object",
      properties: {
        transactionType: {
          type: "string",
          enum: ["legal", "financial", "data-modification", "test", "other"],
          description: "Type of transaction",
        },
        isReversible: { type: "boolean", description: "Whether submission is reversible" },
        dataIsChecked: { type: "boolean", description: "Whether data is checked before submission" },
        canReview: { type: "boolean", description: "Whether user can review before submission" },
        requiresConfirmation: { type: "boolean", description: "Whether confirmation is required" },
      },
      required: ["transactionType"],
    },
  },
  {
    name: "check_input_constraints",
    description: "Check WCAG 3.3.2 and 3.3.5 for input format requirements and help.",
    inputSchema: {
      type: "object",
      properties: {
        fieldName: { type: "string", description: "Field identifier/name" },
        hasFormatRequirements: { type: "boolean", description: "Whether field has format requirements" },
        formatExplained: { type: "boolean", description: "Whether format is explained" },
        exampleProvided: { type: "boolean", description: "Whether example format is provided" },
        hasRealtimeValidation: { type: "boolean", description: "Whether real-time validation exists" },
        hasInputConstraints: { type: "boolean", description: "Whether input is constrained" },
        constraintDescription: { type: "string", description: "Description of constraints" },
      },
      required: ["fieldName", "hasFormatRequirements"],
    },
  },
  {
    name: "check_on_input",
    description: "Check WCAG 3.2.2 On Input. Validates that input doesn't trigger unexpected context changes.",
    inputSchema: {
      type: "object",
      properties: {
        elementType: { type: "string", description: "Element type (select, input, etc.)" },
        changesContextOnInput: { type: "boolean", description: "Whether context changes on input" },
        userWarned: { type: "boolean", description: "Whether user is warned beforehand" },
      },
      required: ["elementType", "changesContextOnInput"],
    },
  },
  {
    name: "validate_form",
    description: "Comprehensive form validation. Checks labels, input purpose, and errors for multiple fields.",
    inputSchema: {
      type: "object",
      properties: {
        fields: {
          type: "array",
          description: "Array of form fields to validate",
          items: {
            type: "object",
            properties: {
              fieldType: { type: "string" },
              hasVisibleLabel: { type: "boolean" },
              hasAccessibleLabel: { type: "boolean" },
              labelText: { type: "string" },
              autocomplete: { type: "string" },
              isRequired: { type: "boolean" },
              requiredIndicatedVisually: { type: "boolean" },
              requiredIndicatedProgrammatically: { type: "boolean" },
            },
            required: ["fieldType", "hasVisibleLabel", "hasAccessibleLabel"],
          },
        },
        errors: {
          type: "object",
          description: "Form error state",
          properties: {
            hasErrors: { type: "boolean" },
            errorsInText: { type: "boolean" },
            errorFieldIdentified: { type: "boolean" },
            hasSuggestions: { type: "boolean" },
            errorAnnounced: { type: "boolean" },
          },
        },
      },
      required: ["fields"],
    },
  },
  {
    name: "get_wcag_forms_criteria",
    description: "Get reference information for all WCAG 2.1 forms-related success criteria.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];
