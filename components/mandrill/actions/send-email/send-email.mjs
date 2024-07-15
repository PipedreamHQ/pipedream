import mandrill from "../../mandrill.app.mjs";

export default {
  key: "mandrill-send-email",
  name: "Send an Email",
  description: "Send an email using Mandrill. [See the documentation](https://mandrillapp.com/api/docs/messages.curl.html#method=send)",
  version: "0.1.2",
  type: "action",
  props: {
    mandrill,
    html: {
      type: "string",
      label: "HTML",
      description: "The full HTML content to be sent",
      optional: true,
    },
    text: {
      type: "string",
      label: "Text",
      description: "Optional full text content to be sent",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The message subject",
      optional: true,
    },
    from_email: {
      type: "string",
      label: "From Email",
      description: "The sender email address",
      optional: true,
    },
    from_name: {
      type: "string",
      label: "From Name",
      description: "Optional from name to be used",
      optional: true,
    },
    email: {
      type: "string",
      label: "Recipient Email",
      description: "The email address of the recipient",
    },
    name: {
      type: "string",
      label: "Recipient Name",
      description: "Optional display name to use for the recipient",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "The header type to use for the recipient, defaults to \"to\" if not provided",
      optional: true,
      options: [
        "to",
        "cc",
        "bcc",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      key: this.mandrill.$auth.api_key,
      message: {
        html: this.html,
        text: this.text,
        subject: this.subject,
        from_email: this.from_email,
        from_name: this.from_name,
        to: [
          {
            email: this.email,
            name: this.name,
            type: this.type || "to",
          },
        ],
      },
    };
    const response = await this.mandrill.sendMessage({
      $,
      data,
    });
    $.export("$summary", `Successfully sent email to ${this.email}`);
    return response;
  },
};
