import { defineAction } from "@pipedream/types";
import app from "../../app/resend.app";

export default defineAction({
  name: "Send Email",
  description:
    "Send an email [See the documentation](https://resend.com/docs/api-reference/emails/send-email)",
  key: "resend-send-email",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    from: {
      type: "string",
      label: "From",
      description:
        "Sender email address. To include a friendly name, use the format `Your Name <sender@domain.com>`",
    },
    to: {
      type: "string[]",
      label: "To",
      description: "Recipient email address(es). Max 50.",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Email subject.",
    },
    html: {
      type: "string",
      label: "HTML",
      description: "The HTML version of the message.",
      optional: true,
    },
    text: {
      type: "string",
      label: "Text",
      description: "The plain text version of the message.",
      optional: true,
    },
    cc: {
      type: "string",
      label: "CCc",
      description: "Cc recipient email address(es).",
      optional: true,
    },
    bcc: {
      type: "string",
      label: "Bcc",
      description: "Bcc recipient email address(es).",
      optional: true,
    },
    replyTo: {
      type: "string",
      label: "Reply To",
      description: "Reply-to email address(es).",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      from, to, subject, html, text, cc, bcc, replyTo,
    } = this;

    const params = {
      $,
      data: {
        from,
        to,
        subject,
        html,
        text,
        cc,
        bcc,
        reply_to: replyTo,
      },
    };

    const response = await this.app.sendEmail(params);
    const { id } = response;
    $.export("$summary", `Sent email (ID: ${id})`);
    return response;
  },
});
