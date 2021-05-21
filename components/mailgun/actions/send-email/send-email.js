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
      label: "Reply Email",
      description: "Sender Reply-To email address",
    },
    to: {
      type: "string[]",
      label: "To Email",
      description: "Recipient email address(es)",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Message subject",
    },
    text: {
      type: "string",
      label: "Text",
      description: "Message body (plain text)",
    },
    html: {
      type: "string",
      label: "HTML",
      description: "Message body (HTML)",
    },
    testMode: {
      type: "boolean",
      default: true,
      description: "Enables sending in test mode",
    },
    dkim: {
      type: "boolean",
      label: "DKIM",
      default: true,
      description: "Enables or disables DKIM signatures",
      optional: true,
    },
    tracking: {
      type: "boolean",
      default: true,
      description: "Enables or disables tracking",
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
        "h:Reply-To": this.replyTo,
        "to": this.to,
        "subject": this.subject,
        "text": this.text,
        "html": this.html,
        "o:testmode": this.testMode,
      };
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
