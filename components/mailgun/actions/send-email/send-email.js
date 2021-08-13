const mailgun = require("../../mailgun.app.js");

module.exports = {
  key: "mailgun-send-email",
  name: "Mailgun Send Email",
  description: "Send email with Mailgun.",
  version: "0.0.2",
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
        "email",
      ],
      label: "From Email",
      description: "Sender email address",
    },
    replyTo: {
      propDefinition: [
        mailgun,
        "email",
      ],
      label: "Reply-To",
      description: "Sender reply email address",
      optional: true,
    },
    to: {
      propDefinition: [
        mailgun,
        "emails",
      ],
      label: "To",
      description: "Recipient email address(es)",
    },
    cc: {
      propDefinition: [
        mailgun,
        "emails",
      ],
      label: "CC",
      description: "Copy email address(es)",
      optional: true,
    },
    bcc: {
      propDefinition: [
        mailgun,
        "emails",
      ],
      label: "BCC",
      description: "Blind copy email address(es)",
      optional: true,
    },
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
        "body_text",
      ],
    },
    html: {
      propDefinition: [
        mailgun,
        "body_html",
      ],
      optional: true,
    },
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
    haltOnError: {
      propDefinition: [
        mailgun,
        "haltOnError",
      ],
    },
  },
  async run () {
    try {
      const msg = {
        "from": `${this.fromName} <${this.from}>`,
        "to": this.to,
        "cc": this.cc,
        "bcc": this.bcc,
        "subject": this.subject,
        "text": this.text,
        "html": this.html,
        "o:testmode": this.testMode,
      };
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
      return await this.mailgun.api("messages").create(this.domain, msg);
    } catch (err) {
      if (this.haltOnError) {
        throw err;
      }
      return err;
    }
  },
};
