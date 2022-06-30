import mailgun from "../../mailgun.app.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "mailgun-send-email",
  name: "Send Email",
  description: "Send email with Mailgun. [See the docs here](https://documentation.mailgun.com/en/latest/api-sending.html#sending)",
  version: "0.0.29",
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
  async run({ $ }) {
    const msg = {
      "from": `${this.fromName} <${this.from}>`,
      "to": this.to,
      "subject": this.subject,
      "text": this.text,
      "html": this.html,
    };
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
    $.export("$summary", "Successfully sent email.");
    return resp;
  },
};
