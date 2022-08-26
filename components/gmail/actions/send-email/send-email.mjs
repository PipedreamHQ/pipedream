/* eslint-disable pipedream/props-description */
import gmail from "../../gmail.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "gmail-send-email",
  name: "Send Email",
  description: "Send an email",
  version: "0.0.1",
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
    signature: {
      propDefinition: [
        gmail,
        "signature",
      ],
    },
    attachments: {
      type: "string[]",
      label: "Attachments",
      description: "A list of attachments. Each attachment sould be a `filename,url` formatted string. The `filename` should contain the file extension (i.e. `.jpeg`, `.txt`) and the `url` is the download link for the file.",
      optional: true,
    },
  },
  async run({ $ }) {
    let from = await this.gmail.myEmailAddress();
    if (this.fromName) from = `${this.fromName} <${from}>`;

    const attachments = this.attachments?.map((attachment) => {
      const [
        filename,
        path,
      ] = attachment.split(",");
      return {
        filename,
        path,
      };
    });

    const opts = {
      from,
      to: this.to,
      cc: this.cc,
      bcc: this.bcc,
      replyTo: this.replyTo,
      subject: this.subject,
      attachments,
    };

    if (this.signature) {
      this.body += this.signature;
      this.bodyType = constants.BODY_TYPES.HTML;
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
