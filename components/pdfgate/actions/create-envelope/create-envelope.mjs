import { ConfigurationError } from "@pipedream/platform";
import app from "../../pdfgate.app.mjs";
import { DOCS_URLS } from "../../common/constants.mjs";
import {
  omitBlank, parseObject, parseObjectArray,
} from "../../common/utils.mjs";

const RECIPIENT_EXAMPLE = "{\"email\":\"jane@example.com\",\"name\":\"Jane Doe\"}";
const ROLE_RECIPIENT_EXAMPLE = "{\"email\":\"jane@example.com\",\"name\":\"Jane Doe\",\"role\":\"Signer\"}";
const DOCUMENT_EXAMPLE = "{\"sourceDocumentId\":\"6acf448aa1adeea302ec88a6\",\"name\":\"Annex A.pdf\",\"recipients\":[" + RECIPIENT_EXAMPLE + "]}";

const normalizeRecipient = (recipient) => {
  if (!recipient?.email || !recipient?.name) {
    throw new ConfigurationError("Each recipient must include both `email` and `name`.");
  }
  return omitBlank({
    email: recipient.email,
    name: recipient.name,
    role: recipient.role,
    reminderIntervalDays: recipient.reminderIntervalDays,
    reminderAttempts: recipient.reminderAttempts,
  });
};

const normalizeDocument = (document, recipientDefaults = {}) => {
  if (!document?.sourceDocumentId || !document?.name) {
    throw new ConfigurationError("Each document must include both `sourceDocumentId` and `name`.");
  }
  const recipients = Array.isArray(document.recipients)
    ? document.recipients
    : [];
  if (!recipients.length) {
    throw new ConfigurationError(`Document "${document.name}" must have at least one recipient.`);
  }
  return {
    sourceDocumentId: document.sourceDocumentId,
    name: document.name,
    recipients: recipients.map((recipient) => normalizeRecipient({
      ...recipientDefaults,
      ...recipient,
    })),
  };
};

export default {
  key: "pdfgate-create-envelope",
  name: "Create Envelope",
  description: `Create a signing envelope from one or more stored PDFGate documents and their recipients. The envelope starts as a draft; use **Send Envelope** to email the signing links, and **Get Envelope** or the **New Envelope Completed** trigger to follow progress. Every document must contain at least one form or signature field. [See the documentation](${DOCS_URLS.createEnvelope})`,
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    requesterName: {
      type: "string",
      label: "Requester Name",
      description: "Name of the person or organisation requesting the signatures, shown to recipients, e.g. `Acme Inc.`.",
    },
    sourceDocumentId: {
      type: "string",
      label: "Source Document ID",
      description: `ID of the stored document to sign, e.g. \`6acf448aa1adeea302ec88a6\`. Use **Generate PDF** (with **Enable Fillable Form Fields** and a \`<pdfgate-signature-field>\`) or **Upload File** (a fillable PDF) and read the \`id\` field of the response. The document must contain at least one form or signature field. [See the form field reference](${DOCS_URLS.formFields})`,
    },
    documentName: {
      type: "string",
      label: "Document Name",
      description: "Name of the document as shown to recipients, e.g. `Service Agreement.pdf`.",
    },
    recipients: {
      type: "string[]",
      label: "Recipients",
      description: `Recipients of the document. Each entry is a JSON object with \`email\` and \`name\`, and optionally \`role\`, \`reminderIntervalDays\` (days between reminder emails; \`0\` disables them) and \`reminderAttempts\` (maximum reminder emails). Example: \`${RECIPIENT_EXAMPLE}\`. \`role\` must match the \`pdfgate-role\` attribute set on the document's fields, e.g. \`${ROLE_RECIPIENT_EXAMPLE}\`; it is required when the document has role-based fields or more than one recipient, and must be omitted for a single recipient on a document whose fields have no role.`,
    },
    reminderIntervalDays: {
      type: "integer",
      label: "Reminder Interval Days",
      description: "Default number of days between signing reminder emails for recipients that do not set their own, e.g. `3`. Empty uses the PDFGate default of 2 days; `0` disables reminders.",
      optional: true,
      min: 0,
    },
    reminderAttempts: {
      type: "integer",
      label: "Reminder Attempts",
      description: "Default maximum number of reminder emails sent to each recipient that does not set their own, e.g. `2`.",
      optional: true,
      min: 0,
    },
    additionalDocuments: {
      type: "string[]",
      label: "Additional Documents",
      description: `Optional extra documents to include in the same envelope. Each entry is a JSON object with \`sourceDocumentId\` (the \`id\` returned by **Generate PDF** or **Upload File**), \`name\` and a \`recipients\` array in the same format as **Recipients**. Example: \`${DOCUMENT_EXAMPLE}\``,
      optional: true,
    },
    metadata: {
      propDefinition: [
        app,
        "metadata",
      ],
    },
  },
  methods: {
    buildRequestBody() {
      const recipientDefaults = omitBlank({
        reminderIntervalDays: this.reminderIntervalDays,
        reminderAttempts: this.reminderAttempts,
      });

      const documents = [
        normalizeDocument({
          sourceDocumentId: this.sourceDocumentId,
          name: this.documentName,
          recipients: parseObjectArray(this.recipients, "Recipients"),
        }, recipientDefaults),
        ...parseObjectArray(this.additionalDocuments, "Additional Documents")
          .map((document) => normalizeDocument(document, recipientDefaults)),
      ];

      return omitBlank({
        requesterName: this.requesterName,
        documents,
        metadata: parseObject(this.metadata, "Metadata"),
      });
    },
  },
  async run({ $ }) {
    const response = await this.app.createEnvelope({
      $,
      data: this.buildRequestBody(),
    });
    $.export("$summary", `Successfully created envelope ${response.id}`);
    return response;
  },
};
