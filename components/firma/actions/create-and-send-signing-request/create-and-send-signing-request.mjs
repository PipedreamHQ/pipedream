import firma from "../../firma.app.mjs";

export default {
  key: "firma-create-and-send-signing-request",
  name: "Create and Send Signing Request",
  description: "Creates and immediately sends a signing request in a single atomic operation. [See the documentation](https://docs.firma.dev/api-reference/signing-requests/create-and-send-signing-request)",
  version: "0.0.1",
  type: "action",
  props: {
    firma,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the signing request",
    },
    templateId: {
      propDefinition: [
        firma,
        "templateId",
      ],
      optional: true,
      description: "The template to use. Mutually exclusive with document.",
    },
    document: {
      type: "string",
      label: "Document",
      description: "Base64-encoded PDF or DOCX document. Mutually exclusive with Template ID.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the signing request",
      optional: true,
    },
    expirationHours: {
      type: "integer",
      label: "Expiration Hours",
      description: "Hours until the signing request expires. Defaults to 168 (7 days).",
      optional: true,
      default: 168,
    },
    recipients: {
      type: "string",
      label: "Recipients",
      description: "JSON array of recipient objects. Each recipient needs: `first_name`, `last_name`, `email`, `designation` (\"Signer\" or \"Approver\"), `order`. Example: `[{\"first_name\": \"John\", \"last_name\": \"Doe\", \"email\": \"john@example.com\", \"designation\": \"Signer\", \"order\": 1}]`",
      optional: true,
    },
    useSigningOrder: {
      type: "boolean",
      label: "Use Signing Order",
      description: "Enforce signing order based on recipient order. When false, all signers receive the document simultaneously.",
      optional: true,
    },
    sendSigningEmail: {
      type: "boolean",
      label: "Send Signing Email",
      description: "Send email notification to signers",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      name: this.name,
    };
    if (this.templateId) data.template_id = this.templateId;
    if (this.document) data.document = this.document;
    if (this.description) data.description = this.description;
    if (this.expirationHours) data.expiration_hours = this.expirationHours;
    if (this.recipients) data.recipients = JSON.parse(this.recipients);
    if (this.useSigningOrder !== undefined || this.sendSigningEmail !== undefined) {
      data.settings = {};
      if (this.useSigningOrder !== undefined) data.settings.use_signing_order = this.useSigningOrder;
      if (this.sendSigningEmail !== undefined) data.settings.send_signing_email = this.sendSigningEmail;
    }
    const response = await this.firma.createAndSendSigningRequest({
      $,
      data,
    });
    $.export("$summary", `Successfully created and sent signing request "${this.name}"`);
    return response;
  },
};
