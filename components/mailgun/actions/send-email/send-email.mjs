import mailgun from "../../mailgun.app.mjs";
import common from "../common.mjs";
import downloader from "@pipedream/helper_functions/actions/download-file-to-tmp/download-file-to-tmp.mjs";

export default {
  ...common,
  key: "mailgun-send-email",
  name: "Send Email",
  description: "Send email with Mailgun. [See the docs here](https://documentation.mailgun.com/en/latest/api-sending.html#sending)",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mailgun,
    domain: {
      propDefinition: [
        mailgun,
        "domain",
      ],
    },
    fromName: {
      propDefinition: [
        mailgun,
        "name",
      ],
      label: "From Name",
      description: "Sender name",
    },
    from: {
      propDefinition: [
        mailgun,
        "emailString",
      ],
      label: "From Email",
      description: "Sender email address",
    },
    /* eslint-disable pipedream/default-value-required-for-optional-props */
    replyTo: {
      propDefinition: [
        mailgun,
        "emailString",
      ],
      label: "Reply-To",
      description: "Sender reply email address",
      optional: true,
    },
    /* eslint-enable pipedream/default-value-required-for-optional-props */
    to: {
      propDefinition: [
        mailgun,
        "emails",
      ],
      label: "To",
      description: "Recipient email address(es)",
    },
    /* eslint-enable pipedream/default-value-required-for-optional-props */
    subject: {
      propDefinition: [
        mailgun,
        "subject",
      ],
      description: "Message subject",
    },
    text: {
      propDefinition: [
        mailgun,
        "bodyText",
      ],
      optional: true,
    },
    /* eslint-disable pipedream/default-value-required-for-optional-props */
    html: {
      propDefinition: [
        mailgun,
        "bodyHtml",
      ],
      optional: true,
    },
    attachments: {
      type: "object",
      label: "Attachments",
      description: "Add any attachments you'd like to include as objects. The `key` should be " +
       "the **filename** and the `value` should be the **url** download link for the attachment.",
      optional: true,
    },
    /* eslint-enable pipedream/default-value-required-for-optional-props */
    testMode: {
      type: "boolean",
      label: "Send in test mode?",
      default: true,
      description: "Enables sending in test mode. For more information, see the [Mailgun API " +
        "documentation](https://documentation.mailgun.com/en/latest/api-sending.html#sending)",
    },
    dkim: {
      type: "boolean",
      label: "Use DKIM?",
      default: true,
      description: "Enables or disables DKIM signatures. For more information, see the [Mailgun " +
        "API documentation](https://documentation.mailgun.com/en/latest/api-sending.html#sending)",
      optional: true,
    },
    tracking: {
      type: "boolean",
      label: "Use Tracking?",
      default: true,
      description: "Enables or disables tracking. For more information, see the [Mailgun API " +
        "documentation](https://documentation.mailgun.com/en/latest/api-sending.html#sending)",
      optional: true,
    },
    ...common.props,
  },
  methods: {
    ...common.methods,
    async download($, attachments) {
      const promises = Object.entries(attachments).map(async ([
        filename,
        url,
      ]) => downloader.run.bind({
        url,
        filename,
      })({
        $,
      }));

      return (await Promise.all(promises))
        .map((filedata) => this.createAttachment(filedata[3], filedata[0]));
    },
    createAttachment(data, filename) {
      return {
        data,
        filename,
      };
    },
  },
  async run({ $ }) {
    const msg = {
      "from": `${this.fromName} <${this.from}>`,
      "to": this.to,
      "subject": this.subject,
      "text": this.text,
      "html": this.html,
    };
    if (this.attachments) {
      msg["attachment"] = await this.download($, this.attachments);
    }
    if (this.testMode) {
      msg["o:testmode"] = "yes";
    }
    if (this.replyTo) {
      msg["h:Reply-To"] = this.replyTo;
    }
    if (this.dkim !== null) {
      msg["o:dkim"] = this.dkim
        ? "yes"
        : "no";
    }
    if (this.tracking) {
      msg["o:tracking"] = "yes";
    }
    const resp = await this.withErrorHandler(this.mailgun.sendMail, {
      domain: this.domain,
      msg,
    });
    $.export("filedata", null); // remove set filedata from downloader
    $.export("$summary", "Successfully sent email.");
    return resp;
  },
};
