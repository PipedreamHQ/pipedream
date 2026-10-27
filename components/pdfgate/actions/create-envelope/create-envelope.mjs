import { ConfigurationError } from "@pipedream/platform";
import app from "../../pdfgate.app.mjs";
import { DOCS_URL } from "../../common/constants.mjs";
import {
  omitBlank, parseObject, parseObjectArray,
} from "../../common/utils.mjs";

const RECIPIENT_EXAMPLE = "{\"email\":\"jane@example.com\",\"name\":\"Jane Doe\",\"role\":\"Signer\"}";
const DOCUMENT_EXAMPLE = "{\"sourceDocumentId\":\"<document id>\",\"name\":\"NDA.pdf\",\"recipients\":[" + RECIPIENT_EXAMPLE + "]}";

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

const normalizeDocument = (document) => {
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
    recipients: recipients.map(normalizeRecipient),
  };
};

export default {
  key: "pdfgate-create-envelope",
  name: "Create Envelope",
  description: `Create a signing envelope from one or more existing PDFGate documents. Use **Send Envelope** afterwards to email the recipients. [See the documentation](${DOCS_URL})`,
  version: "0.0.1",
  type: "action",
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
      description: "The name of the person or system requesting the signatures.",
    },
    sourceDocumentId: {
      type: "string",
      label: "Source Document ID",
      description: "ID of the existing PDFGate document to sign. The document must contain at least one form or signature field (for example a PDF generated with **Enable Fillable Form Fields** and a `pdfgate-signature-field`, or an uploaded fillable PDF). You can map this from a previous step such as **Generate PDF** or **Upload File**.",
    },
    documentName: {
      type: "string",
      label: "Document Name",
      description: "Name of the document as shown to recipients, e.g. `Service Agreement.pdf`.",
    },
    recipients: {
      type: "string[]",
      label: "Recipients",
      description: `Recipients for the document. Each entry is a JSON object with \`email\` and \`name\`, and optionally \`role\`, \`reminderIntervalDays\` (days between reminder emails; \`0\` disables reminders) and \`reminderAttempts\` (maximum reminder emails per recipient). \`role\` must match the \`pdfgate-role\` attribute set on the document's fields; it is required when the document has role-based fields or more than one recipient, and must be omitted for a single recipient on a document whose fields have no role. Example: \`${RECIPIENT_EXAMPLE}\``,
    },
    reminderIntervalDays: {
      type: "integer",
      label: "Reminder Interval Days",
      description: "Default number of days between signing reminder emails for recipients that do not set their own. Leave blank for the PDFGate default of 2 days, or set to `0` to disable reminders.",
      optional: true,
      min: 0,
    },
    reminderAttempts: {
      type: "integer",
      label: "Reminder Attempts",
      description: "Default maximum number of reminder emails sent to each recipient that does not set their own.",
      optional: true,
      min: 0,
    },
    additionalDocuments: {
      type: "string[]",
      label: "Additional Documents",
      description: `Optional extra documents to include in the same envelope. Each entry is a JSON object with \`sourceDocumentId\`, \`name\` and a \`recipients\` array. Example: \`${DOCUMENT_EXAMPLE}\``,
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

      const primaryRecipients = parseObjectArray(this.recipients, "Recipients")
        .map((recipient) => ({
          ...recipientDefaults,
          ...recipient,
        }));

      const documents = [
        normalizeDocument({
          sourceDocumentId: this.sourceDocumentId,
          name: this.documentName,
          recipients: primaryRecipients,
        }),
        ...parseObjectArray(this.additionalDocuments, "Additional Documents").map(normalizeDocument),
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
