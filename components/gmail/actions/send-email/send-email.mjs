/* eslint-disable pipedream/props-description */
import gmail from "../../gmail.app.mjs";

export default {
  key: "gmail-send-email",
  name: "Send Email",
  description: "Send an email from your Google Workspace email account",
  version: "0.0.12",
  type: "action",
  props: {
    gmail,
    to: {
      propDefinition: [
        gmail,
        "to",
      ],
    },
    cc: {
      propDefinition: [
        gmail,
        "cc",
      ],
    },
    bcc: {
      propDefinition: [
        gmail,
        "bcc",
      ],
    },
    fromName: {
      propDefinition: [
        gmail,
        "fromName",
      ],
    },
    replyTo: {
      propDefinition: [
        gmail,
        "replyTo",
      ],
    },
    subject: {
      propDefinition: [
        gmail,
        "subject",
      ],
    },
    body: {
      propDefinition: [
        gmail,
        "body",
      ],
    },
    bodyType: {
      propDefinition: [
        gmail,
        "bodyType",
      ],
    },
    inReplyTo: {
      propDefinition: [
        gmail,
        "inReplyTo",
      ],
    },
    mimeType: {
      propDefinition: [
        gmail,
        "mimeType",
      ],
    },
    attachmentName_0: {
      type: "string",
      label: "Attachment Name #0",
      description: "The name of the attachment. Must contain the extension (i.e. `.jpeg`, `.txt`)",
      optional: true,
      reloadProps: true,
    },
  },
  additionalProps() {
    const props = {};
    let count = 0;

    while (true) {
      if (this[`attachmentName_${count}`]) {
        props[`attachmentUrl_${count}`] = {
          type: "string",
          label: `Attachment URL #${count}`,
          description: "The download URL of the file",
        };
      } else {
        break;
      }

      count++;

      props[`attachmentName_${count}`] = {
        type: "string",
        label: `Attachment Name #${count}`,
        description: "The name of the attachment. Must contain the extension (i.e. `.jpeg`, `.txt`)",
        optional: true,
        reloadProps: true,
      };
    }

    return props;
  },
  methods: {
    parseAttachments() {
      const attachments = [];
      let count = 0;

      while (true) {
        if (!this[`attachmentName_${count}`]) {
          break;
        }

        attachments.push({
          filename: this[`attachmentName_${count}`],
          path: this[`attachmentUrl_${count}`],
        });
        count++;
      }

      if (attachments.length) {
        return attachments;
      }
    },
  },
  async run({ $ }) {
    const opts = await this.gmail.getOptionsToSendEmail($, this);
    opts.attachments = this.parseAttachments();
    const response = await this.gmail.sendEmail(opts);
    $.export("$summary", `Successfully sent email to ${this.to}`);
    return response;
  },
};
