import {
  ConfigurationError,
  getFileStreamAndMetadata,
} from "@pipedream/platform";
import firma from "../../firma.app.mjs";
import {
  INLINE_DOCUMENT_MAX_BYTES,
  UPLOAD_DOCUMENT_MAX_BYTES,
} from "../../common/constants.mjs";
import {
  classifyCreateAndSendFailure,
  describeCreateAndSendFailure,
  documentContentType,
  matchTemplateRecipients,
  parseJsonArray,
  validateDocumentRecipients,
  validateTemplateFieldOverrides,
} from "../../common/utils.mjs";

const TOO_LARGE = "The document is larger than 50 MB, the most Firma accepts.";

export default {
  key: "firma-create-and-send-signing-request",
  name: "Create and Send Signing Request",
  description: "Creates a signing request from a template or from a PDF or DOCX file and sends it to the recipients in one call. Each run sends a legally binding request and uses one Firma credit. Use **List Templates** and **Get Template** to find a template and its signing roles. Template sends need exactly one recipient for every Signer and Approver of the template (matched by `template_user_id`, then `order`); the action refuses, before sending, a missing role, a recipient that matches no role and two recipients for one role, because Firma would leave such a recipient out. Documents up to 4 MiB are sent inline; larger ones, up to 50 MB, are uploaded first and sent by `document_id`. If Firma does not confirm the result (a network error, a timeout or a 5xx answer), the request may still have been sent: the error says so, and the step must not simply be run again. [See the documentation](https://docs.firma.dev/api-reference/signing-requests/create-and-send-signing-request-atomic)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
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
      description: "A PDF or DOCX document to send instead of a template: a URL or a path to a file in the `/tmp` directory, for example `/tmp/contract.pdf`. Up to 50 MB: a document up to 4 MiB (4,194,304 bytes) is sent inline, a larger one is first uploaded to Firma (`POST /documents`) and sent by its `document_id`. Set either this or **Template ID**, not both. Document sends need **Recipients** and usually **Fields**.",
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
      description: "A JSON array of recipients. Each needs `first_name`, `email`, `designation` (`Signer`, `Approver` or `CC`) and `order` (signing sequence, lower signs first); `last_name` is optional. Document example: `[{\"id\": \"temp_1\", \"first_name\": \"Jane\", \"last_name\": \"Doe\", \"email\": \"jane@example.com\", \"designation\": \"Signer\", \"order\": 1}]` (the `temp_1` id lets **Fields** refer to the recipient). Template sends: give exactly one recipient per Signer and Approver of the template and match it with `template_user_id` (from **Get Template**, `recipients[].id`) or with the template user's `order`, for example `[{\"template_user_id\": \"<uuid>\", \"first_name\": \"Jane\", \"email\": \"jane@example.com\"}]`; the template's designation and order always apply. A template whose roles share an order (parallel signers) needs `template_user_id` on every Signer and Approver recipient, and so do recipients that share an order (a recipient without `order` counts as its position in the list). A template with a single signing role accepts one recipient without `template_user_id` or `order`. Omit the prop on a template send to use the recipients saved on the template. CC recipients are added as extra copies.",
      optional: true,
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "A JSON array. Document sends: the fields to place on the document. Each needs `type` (for example `signature`, `date`, `text`, `checkbox`), `page`, `x`, `y` and usually `width`, `height` and `recipient_id` (a recipient `id` such as `temp_1`); positions and sizes are percentages of the page (0 to 100, with x + width and y + height at most 100). Example: `[{\"type\": \"signature\", \"recipient_id\": \"temp_1\", \"page\": 1, \"x\": 10, \"y\": 80, \"width\": 30, \"height\": 8, \"required\": true}]`. Template sends: values for the template's own fields, each named by `template_field_id` (a field `id` from **Get Template**), `variable_name` or `variable_defined_name`, with `value` (or `read_only_value` together with `read_only: true` to stop the signer changing it; a template field that is already read-only stays read-only), for example `[{\"template_field_id\": \"<uuid>\", \"value\": \"Acme Ltd\"}]`; Firma refuses a value for a field the template does not have. See the field object in the documentation for every option.",
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
    getDocumentFile() {
      return getFileStreamAndMetadata(this.filePath);
    },
    /**
     * Reads the document, up to 50 MB. The reported size refuses an oversized file
     * before reading; the bytes actually read decide the rest.
     * @returns {Promise<{content: Buffer, name: string, contentType: string}>}
     */
    async readDocument() {
      const {
        stream, metadata,
      } = await this.getDocumentFile();
      if (metadata?.size > UPLOAD_DOCUMENT_MAX_BYTES) {
        stream.destroy?.();
        throw new ConfigurationError(TOO_LARGE);
      }
      const chunks = [];
      let size = 0;
      for await (const chunk of stream) {
        size += chunk.length;
        if (size > UPLOAD_DOCUMENT_MAX_BYTES) {
          stream.destroy?.();
          throw new ConfigurationError(TOO_LARGE);
        }
        chunks.push(chunk);
      }
      const name = (metadata?.name || "document.pdf").slice(0, 255);
      return {
        content: Buffer.concat(chunks, size),
        name,
        contentType: documentContentType(name, metadata?.contentType),
      };
    },
    /**
     * Uploads a document through `POST /documents` and the pre-signed URL it returns.
     * Nothing is created or sent if this fails.
     * @returns {Promise<string>} The `document_id`
     */
    async uploadDocument($, {
      content, name, contentType,
    }) {
      const upload = await this.firma.createDocumentUpload({
        $,
        data: {
          file_name: name,
          file_size: content.length,
          content_type: contentType,
        },
      });
      if (!upload?.document_id || typeof upload.upload_url !== "string") {
        throw new Error("Firma did not return an upload URL for the document. Nothing was sent; the step can be run again.");
      }
      try {
        await this.firma.uploadDocumentContent({
          $,
          uploadUrl: upload.upload_url,
          content,
          contentType,
        });
      } catch (err) {
        const answer = err?.response?.status
          ? `HTTP ${err.response.status}`
          : "no response";
        throw new Error(`The document upload to Firma failed (${answer}). Nothing was sent; the step can be run again.`);
      }
      return upload.document_id;
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
        validateTemplateFieldOverrides(fields);
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
      const document = await this.readDocument();
      if (document.content.length > INLINE_DOCUMENT_MAX_BYTES) {
        data.document_id = await this.uploadDocument($, document);
      } else {
        data.document = document.content.toString("base64");
      }
    }
    data.recipients = recipients;
    data.fields = fields;

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
    const label = `signing request "${response.name || this.name}" (${response.id})`;
    $.export("$summary", response?.settings?.send_signing_email === false
      ? `Created ${label}; no signing email was sent, so deliver the signing links another way`
      : `Sent ${label}`);
    return response;
  },
};
