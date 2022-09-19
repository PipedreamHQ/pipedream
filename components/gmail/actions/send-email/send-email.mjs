/* eslint-disable pipedream/props-description */
import gmail from "../../gmail.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "gmail-send-email",
  name: "Send Email",
  description: "Send an email from your Google Workspace email account",
  version: "0.0.5",
  type: "action",
  props: {
    gmail,
    to: {
      type: "string[]",
      label: "To",
      description: "Enter a single recipient's email or multiple emails as items in an array.",
    },
    cc: {
      type: "string[]",
      label: "Cc",
      optional: true,
      description: "Enter a single recipient's email or multiple emails as items in an array.",
    },
    bcc: {
      type: "string[]",
      label: "Bcc",
      optional: true,
      description: "Enter a single recipient's email or multiple emails as items in an array.",
    },
    fromName: {
      type: "string",
      label: "From Name",
      description: "Specify the name that will be displayed in the \"From\" section of the email.",
      optional: true,
    },
    replyTo: {
      type: "string",
      label: "Reply To",
      description: "Specify the email address that will appear on the \"Reply-To\" field, if different than the sender's email.",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Specify a subject for the email.",
    },
    body: {
      type: "any",
      label: "Email Body",
      description: "Include an email body as either plain text or HTML. If HTML, make sure to set the \"Body Type\" prop to `html`.",
    },
    bodyType: {
      type: "string",
      label: "Body Type",
      description: "Choose to send as plain text or HTML. Defaults to `plaintext`.",
      optional: true,
      default: "plaintext",
      options: Object.values(constants.BODY_TYPES),
    },
    attachments: {
      type: "object",
      label: "Attachments",
      description: "Add any attachments you'd like to include as objects. The `key` should be the **filename** and the `value` should be the **url** for the attachment. The **filename** must contain the file extension (i.e. `.jpeg`, `.txt`) and the **url** is the download link for the file.",
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
    $.export("$summary", `Successfully sent email to ${this.to.join(", ")}`);
    return response;
  },
};
