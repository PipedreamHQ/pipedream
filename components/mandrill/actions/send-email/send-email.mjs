// legacy_hash_id: a_njiaQg
import { axios } from "@pipedream/platform";

export default {
  key: "mandrill-send-email",
  name: "Send an Email",
  description: "Send an email using Mandrill. See API docs here: https://mandrillapp.com/api/docs/messages.curl.html#method=send",
  version: "0.1.1",
  type: "action",
  props: {
    mandrill: {
      type: "app",
      app: "mandrill",
    },
    html: {
      type: "string",
      description: "The full HTML content to be sent",
      optional: true,
    },
    text: {
      type: "string",
      description: "Optional full text content to be sent",
      optional: true,
    },
    subject: {
      type: "string",
      description: "The message subject",
      optional: true,
    },
    from_email: {
      type: "string",
      description: "The sender email address",
      optional: true,
    },
    from_name: {
      type: "string",
      description: "Optional from name to be used",
      optional: true,
    },
    email: {
      type: "string",
      description: "The email address of the recipient",
    },
    name: {
      type: "string",
      description: "Optional display name to use for the recipient",
      optional: true,
    },
    type: {
      type: "string",
      description: "the header type to use for the recipient, defaults to \"to\" if not provided",
      optional: true,
      options: [
        "to",
        "cc",
        "bcc",
      ],
    },
  },
  async run({ $ }) {
    return await axios($, {
      url: "https://mandrillapp.com/api/1.0/messages/send.json",
      data: {
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
      },
    });
  },
};
