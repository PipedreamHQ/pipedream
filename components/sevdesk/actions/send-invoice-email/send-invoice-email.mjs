import { ConfigurationError } from "@pipedream/platform";
import sevdesk from "../../sevdesk.app.mjs";

export default {
  key: "sevdesk-send-invoice-email",
  name: "Send Invoice Email",
  description: "Sends an invoice via email. [See the documentation](https://api.sevdesk.de/#tag/Invoice/operation/sendInvoiceViaEMail)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sevdesk,
    invoiceId: {
      propDefinition: [
        sevdesk,
        "invoiceId",
      ],
    },
    toEmail: {
      type: "string",
      label: "To Email",
      description: "The recipient of the email.",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the email.",
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text of the email. Can contain html.",
    },
    copy: {
      type: "boolean",
      label: "Copy",
      description: "Should a copy of this email be sent to you?",
      optional: true,
    },
    additionalAttachments: {
      type: "string[]",
      label: "Additional Attachments",
      description: "Additional attachments to the mail. List of IDs of existing documents in your * sevdesk account",
      optional: true,
    },
    ccEmail: {
      type: "string[]",
      label: "Cc Email",
      description: "List of mail addresses to be put as cc",
      optional: true,
    },
    bccEmail: {
      type: "string[]",
      label: "Bcc Email",
      description: "List of mail addresses to be put as bcc",
      optional: true,
    },

  },
  async run({ $ }) {

    try {
      const response = await this.sevdesk.sendInvoice({
        $,
        invoiceId: this.invoiceId,
        data: {
          toEmail: this.toEmail,
          subject: this.subject,
          text: this.text,
          copy: this.copy,
          additionalAttachments: this.additionalAttachments
            ? this.additionalAttachments.join()
            : null,
          ccEmail: this.ccEmail
            ? this.ccEmail.join()
            : null,
          bccEmail: this.bccEmail
            ? this.bccEmail.join()
            : null,
        },
      });

      $.export("$summary", `Successfully sent invoice ${this.invoiceId} via email to ${this.toEmail}`);
      return response;
    } catch ({ message }) {
      throw new ConfigurationError(JSON.parse(message).error.message);
    }
  },
};
