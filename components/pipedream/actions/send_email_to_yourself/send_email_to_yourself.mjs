export default {
  name: "Send an email to yourself",
  version: "0.0.{{ts}}",
  key: "send_email_to_yourself",
  description: "Customize and send an email to the email address you registered with Pipedream. The email will be sent from `notifications@pipedream.com`.",
  props: {
    subject: {
      type: "string",
      description: "Subject of the email",
      optional: true,
    },
    text: {
      type: "string",
      description: "Plain text email body",
      optional: true,
    },
    html: {
      type: "string",
      description: "HTML email body",
      optional: true,
    },
    include_collaborators: {
      type: "boolean",
      description: "When set to `true`, this will include any collaborators you've added to your workflow.",
      optional: true,
    },
  },
  type: "action",
  async run({ steps, $ }) {
    $.send.email({
      subject: this.subject,
      text: this.text,
      html: this.email,
      include_collaborators: this.include_collaborators,
    });
  },
};