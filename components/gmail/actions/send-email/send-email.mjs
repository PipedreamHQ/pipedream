/* eslint-disable pipedream/props-description */
import gmail from "../../gmail.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "gmail-send-email",
  name: "Send Email",
  description: "Send an email from your Google Workspace email account",
  version: "0.0.2",
  type: "action",
  props: {
    gmail,
    to: {
      type: "string[]",
      label: "To",
    },
    cc: {
      type: "string[]",
      label: "Cc",
      optional: true,
    },
    bcc: {
      type: "string[]",
      label: "Bcc",
      optional: true,
    },
    fromName: {
      type: "string",
      label: "From Name",
      description: "A name that will be displayed in the `From` section of the email",
      optional: true,
    },
    replyTo: {
      type: "string",
      label: "Reply To",
      description: "An email address that will appear on the `Reply To` field",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the email",
    },
    body: {
      type: "any",
      label: "Email Body",
      description: "The email body plain text or html",
    },
    bodyType: {
      type: "string",
      label: "Body Type",
      description: "Plain Text or HTML. Defaults to `plaintext`.",
      optional: true,
      default: "plaintext",
      options: Object.values(constants.BODY_TYPES),
    },
    attachments: {
      type: "object",
      label: "Attachments",
      description: "Add any attachments you'd like to include as objects. The `key` should be the **filename** and the `value` should be the **url** for the attachment, respectively. The **filename** must contain the file extension (i.e. `.jpeg`, `.txt`) and the **url** is the download link for the file.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      name: fromName,
      email,
    } = await this.gmail.userInfo();

    const opts = {
      from: this.fromName
        ? `${this.fromName} <${email}>`
        : `${fromName} <${email}>`,
      to: this.to,
      cc: this.cc,
      bcc: this.bcc,
      replyTo: this.replyTo,
      subject: this.subject,
    };

    if (this.attachments) {
      opts.attachments = Object.entries(this.attachments)
        .map(([
          filename,
          path,
        ]) => ({
          filename,
          path,
        }));
    }

    if (this.bodyType === constants.BODY_TYPES.HTML) {
      opts.html = this.body;
    } else {
      opts.text = this.body;
    }

    const response = await this.gmail.sendEmail(opts);
    $.export("$summary", `Successfully sent email to ${this.to}`);
    return response;
  },
};
