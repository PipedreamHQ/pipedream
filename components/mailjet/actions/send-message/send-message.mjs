import mailjetApp from "../../mailjet.app.mjs";

export default {
  key: "mailjet-send-message",
  name: "Send Message",
  description: "Send a message via Send API v3. Send API v3 is built mainly for speed, allowing you to send up to 100 messages in a single API call. [See the docs here](https://dev.mailjet.com/email/reference/send-emails/#v3_1_post_send)",
  type: "action",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    mailjetApp,
    fromEmail: {
      type: "string",
      label: "From Email",
      description: "Specifies the sender email address.",
    },
    fromName: {
      type: "string",
      label: "From Name",
      description: "Sender name that will be displayed in the recipient's mailbox.",
      optional: true,
    },
    sender: {
      type: "boolean",
      label: "Sender",
      description: "When true, default sender email address will be used to send the message, while the **From Email** will be displayed in the recipient's inbox. In such cases, it is not necessary for the **From Email** to be verified. However, the information will be displayed in the inbox as `From {from_email} via / sent on behalf of {sender_domain}`.",
      optional: true,
    },
    to: {
      type: "string",
      label: "To",
      description: "The email address (and name, optionally) of the recipients. Acceptable formats are `john@example.com` or `<john@example.com>` or `\"John Doe\" <john@example.com>`. Can include multiple contacts, which should be separated by commas. Can be used together with **Cc** and **Bcc**.",
      optional: true,
    },
    cc: {
      type: "string",
      label: "Cc",
      description: "The email address (and name, optionally) of a recipient who is supposed to receive a carbon copy (cc) of this message. Used together with **To** and **Bcc** (optional). Acceptable formats are `john@example.com` or `<john@example.com>` or `\"John Doe\" <john@example.com>`. Can include multiple contacts, which should be separated by commas.",
      optional: true,
    },
    bcc: {
      type: "string",
      label: "Bcc",
      description: "The email address (and name, optionally) of a recipient who is supposed to receive a blind carbon copy (bcc) of this message. Use this when you do not want your other recipients to see that you are sending a copy of the message to this email address. Used together with **To** and **Cc** (optional). Acceptable formats are `john@example.com` or `<john@example.com>` or `\"John Doe\" <john@example.com>`. Can include multiple contacts, which should be separated by commas.",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The email subject line.",
      optional: true,
    },
    textPart: {
      type: "string",
      label: "Text Part",
      description: "Provides the Text part of the message. Mandatory, if the Html-part parameter is not specified.",
      optional: true,
    },
    htmlPart: {
      type: "string",
      label: "HTML Part",
      description: "Provides the HTML part of the message. Mandatory, if the Text-part parameter is not specified.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      fromEmail,
      fromName,
      sender,
      to,
      cc,
      bcc,
      subject,
      textPart,
      htmlPart,
    } = this;

    try {
      const { body: { Sent: response } } =
        await this.mailjetApp.sendMessage({
          data: {
            "FromEmail": fromEmail,
            "FromName": fromName,
            "Sender": sender,
            "To": to,
            "Cc": cc,
            "Bcc": bcc,
            "Subject": subject,
            "Text-part": textPart,
            "Html-part": htmlPart,
          },
        });

      $.export("$summary", `Successfully sent email message with ID ${response[0].MessageID}`);

      return response[0];

    } catch (error) {
      throw error.response?.res?.statusMessage ?? error;
    }
  },
};
