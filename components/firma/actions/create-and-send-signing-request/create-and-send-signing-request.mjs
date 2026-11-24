import {
  ConfigurationError,
  getFileStreamAndMetadata,
} from "@pipedream/platform";
import firma from "../../firma.app.mjs";
import {
  classifyCreateAndSendFailure,
  describeCreateAndSendFailure,
  matchTemplateRecipients,
  parseJsonArray,
  validateDocumentRecipients,
} from "../../common/utils.mjs";

const MAX_DOCUMENT_BYTES = 5 * 1024 * 1024;

export default {
  key: "firma-create-and-send-signing-request",
  name: "Create and Send Signing Request",
  description: "Creates a signing request from a template or from a PDF or DOCX file and sends it to the recipients in one call. Each run sends a legally binding request and uses one Firma credit. Use **List Templates** and **Get Template** to find a template and its signing roles. Template sends need a recipient for every Signer and Approver of the template (matched by `template_user_id`, then `order`); the action checks this before sending. If Firma does not confirm the result (a network error, a timeout or a 5xx answer), the request may still have been sent: the error says so, and the step must not simply be run again. [See the documentation](https://docs.firma.dev/api-reference/signing-requests/create-and-send-signing-request-atomic)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    firma,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the signing request, shown to recipients, for example `Employment contract - Jane Doe`.",
    },
    templateId: {
      propDefinition: [
        firma,
        "templateId",
      ],
      optional: true,
      description: "The UUID of the template to send, for example `a12a33db-4d52-41ad-a66b-b45f6dc2830a`. Use **List Templates** to find it. Set either this or **File Path or URL**, not both.",
    },
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "A PDF or DOCX document to send instead of a template: a URL or a path to a file in the `/tmp` directory, for example `/tmp/contract.pdf`. Up to 5 MB. Set either this or **Template ID**, not both. Document sends need **Recipients** and usually **Fields**.",
      format: "file-ref",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
    recipients: {
      type: "string",
      label: "Recipients",
      description: "A JSON array of recipients. Each needs `first_name`, `email`, `designation` (`Signer`, `Approver` or `CC`) and `order` (signing sequence, lower signs first); `last_name` is optional. Document example: `[{\"id\": \"temp_1\", \"first_name\": \"Jane\", \"last_name\": \"Doe\", \"email\": \"jane@example.com\", \"designation\": \"Signer\", \"order\": 1}]` (the `temp_1` id lets **Fields** refer to the recipient). Template sends: give one recipient per Signer and Approver of the template and match it with `template_user_id` (from **Get Template**, `recipients[].id`) or with the template user's `order`, for example `[{\"template_user_id\": \"<uuid>\", \"first_name\": \"Jane\", \"email\": \"jane@example.com\"}]`; the template's designation and order always apply. A template with a single signing role accepts one recipient without `template_user_id` or `order`. Omit the prop on a template send to use the recipients saved on the template. CC recipients are added as extra copies.",
      optional: true,
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Document sends only. A JSON array of fields to place on the document. Each needs `type` (for example `signature`, `date`, `text`, `checkbox`), `page`, `x`, `y` and usually `width`, `height` and `recipient_id` (a recipient `id` such as `temp_1`). Example: `[{\"type\": \"signature\", \"recipient_id\": \"temp_1\", \"page\": 1, \"x\": 100, \"y\": 200, \"width\": 200, \"height\": 50, \"required\": true}]`. See the field object in the documentation for every option.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the signing request.",
      optional: true,
    },
    expirationHours: {
      type: "integer",
      label: "Expiration Hours",
      description: "Hours until the signing request expires, for example `168` (7 days). When omitted, Firma uses the template's value for template sends, then the company default.",
      optional: true,
      min: 1,
    },
    useSigningOrder: {
      type: "boolean",
      label: "Use Signing Order",
      description: "When `true`, recipients sign one after another by `order`. When `false`, all signers receive the request at the same time. When omitted, the template or account setting applies.",
      optional: true,
    },
    sendSigningEmail: {
      type: "boolean",
      label: "Send Signing Email",
      description: "When `false`, Firma sends no signing email and the signing links must be delivered another way. When omitted, Firma sends the email.",
      optional: true,
    },
  },
  methods: {
    async readDocument() {
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(this.filePath);
      if (metadata?.size > MAX_DOCUMENT_BYTES) {
        throw new ConfigurationError("The document is larger than 5 MB, the limit for this action.");
      }
      const chunks = [];
      let size = 0;
      for await (const chunk of stream) {
        size += chunk.length;
        if (size > MAX_DOCUMENT_BYTES) {
          throw new ConfigurationError("The document is larger than 5 MB, the limit for this action.");
        }
        chunks.push(chunk);
      }
      return Buffer.concat(chunks).toString("base64");
    },
  },
  async run({ $ }) {
    if (!this.templateId === !this.filePath) {
      throw new ConfigurationError("Set exactly one of **Template ID** or **File Path or URL**.");
    }
    let recipients = parseJsonArray(this.recipients, "Recipients");
    const fields = parseJsonArray(this.fields, "Fields");
    const data = {
      name: this.name,
      description: this.description,
      expiration_hours: this.expirationHours,
    };

    if (this.templateId) {
      if (fields) {
        throw new ConfigurationError("**Fields** apply to document sends only; template sends use the template's fields.");
      }
      data.template_id = this.templateId;
      if (recipients) {
        const template = await this.firma.getTemplate({
          $,
          templateId: this.templateId,
        });
        recipients = matchTemplateRecipients(template?.recipients, recipients);
      }
    } else {
      validateDocumentRecipients(recipients);
      data.document = await this.readDocument();
      data.fields = fields;
    }
    data.recipients = recipients;

    if (this.useSigningOrder !== undefined || this.sendSigningEmail !== undefined) {
      data.settings = {
        use_signing_order: this.useSigningOrder,
        send_signing_email: this.sendSigningEmail,
      };
    }

    let response;
    try {
      response = await this.firma.createAndSendSigningRequest({
        $,
        data,
      });
    } catch (err) {
      const message = describeCreateAndSendFailure(classifyCreateAndSendFailure(err));
      if (message) {
        throw new Error(message);
      }
      throw err;
    }
    $.export("$summary", `Sent signing request "${response.name || this.name}" (${response.id})`);
    return response;
  },
};
