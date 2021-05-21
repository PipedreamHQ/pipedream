const mailgun = require("../../mailgun.app.js");

module.exports = {
  key: "mailgun-send-email",
  name: "Mailgun Send Email",
  description: "Send email with Mailgun.",
  version: "0.0.1",
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
      type: "string",
      label: "From Name",
      description: "Sender name",
    },
    from: {
      type: "string",
      label: "From Email",
      description: "Sender email address",
    },
    replyTo: {
      type: "string",
      label: "Reply-To",
      description: "Sender reply email address",
      optional: true,
    },
    to: {
      type: "string[]",
      label: "To",
      description: "Recipient email address(es)",
    },
    cc: {
      type: "string[]",
      label: "CC",
      description: "Copy email address(es)",
      optional: true,
    },
    bcc: {
      type: "string[]",
      label: "BCC",
      description: "Blind copy email address(es)",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Message subject",
    },
    text: {
      type: "string",
      label: "Message Body (text)",
    },
    html: {
      type: "string",
      label: "Message Body (HTML)",
      optional: true,
    },
    testMode: {
      type: "boolean",
      label: "Send in test mode?",
      default: true,
      description: "Enables sending in test mode. For more information, see the [Mailgun API documentation](https://documentation.mailgun.com/en/latest/api-sending.html#sending)",
    },
    dkim: {
      type: "boolean",
      label: "Use DKIM?",
      default: true,
      description: "Enables or disables DKIM signatures. For more information, see the [Mailgun API documentation](https://documentation.mailgun.com/en/latest/api-sending.html#sending)",
      optional: true,
    },
    tracking: {
      type: "boolean",
      label: "Use Tracking?",
      default: true,
      description: "Enables or disables tracking. For more information, see the [Mailgun API documentation](https://documentation.mailgun.com/en/latest/api-sending.html#sending)",
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
