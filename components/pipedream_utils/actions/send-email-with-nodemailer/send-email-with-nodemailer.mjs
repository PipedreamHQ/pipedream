// legacy_hash_id: a_EViLg3
import nodemailer from "nodemailer";
import pipedream_utils from "../../pipedream_utils.app.mjs";

export default {
  key: "pipedream_utils-send-email-with-nodemailer",
  name: "Helper Functions - Send email with Nodemailer",
  description: "Sends an email using the nodemailer package",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipedream_utils,
    host: {
      type: "string",
      description: "The hostname or IP address of your SMTP server",
    },
    port: {
      type: "string",
      description: "The port your SMTP server listens on (defaults to 587 if is secure is false or 465 if true)",
    },
    secure: {
      type: "boolean",
      description: "If `true` the connection will use TLS when connecting to server. If `false` (the default) then TLS is used if server supports the **STARTTLS** extension. In most cases set this value to `true` if you are connecting to port 465. For port 587 or 25 keep it `false`",
      optional: true,
    },
    ignoreTLS: {
      type: "boolean",
      label: "Ignore TLS",
      description: "If this is `true` and **secure** is `false` then TLS is not used even if the server supports **STARTTLS** extension",
      optional: true,
    },
    requireTLS: {
      type: "boolean",
      label: "Require TLS",
      description: "If this is `true` and **secure** is `false` then Nodemailer tries to use **STARTTLS** even if the server does not advertise support for it. If the connection can not be encrypted then message is not sent",
      optional: true,
    },
    user: {
      type: "string",
      description: "The username you use to connect to your SMTP server",
    },
    pass: {
      type: "string",
      description: "Your password",
    },
    from: {
      type: "string",
      description: "The email address of the sender. All email addresses can be plain 'sender@server.com' or formatted '\"Sender Name\" <sender@server.com>'",
    },
    to: {
      type: "string",
      description: "Comma separated list or an array of recipients email addresses that will appear on the To: field",
    },
    cc: {
      type: "string",
      description: "Comma separated list or an array of recipients email addresses that will appear on the Cc: field",
      optional: true,
    },
    subject: {
      type: "string",
      description: "The subject of the email",
    },
    text: {
      type: "string",
      description: "The plain text version of the message",
      optional: true,
    },
    html: {
      type: "string",
      description: "The HTML version of the message",
      optional: true,
    },
  },
  async run() {
    // See the Nodemailer docs for all options:
    // https://nodemailer.com/usage/
    var transporter = nodemailer.createTransport({
      host: this.host,
      port: this.port,
      secure: this.secure,
      ignoreTLS: this.ignoreTLS,
      requireTLS: this.requireTLS,
      auth: {
        user: this.user,
        pass: this.pass,
      },
    });

    var mailOptions = {
      from: this.from,
      to: this.to,
      cc: this.cc,
      subject: this.subject,
      text: (this.text || ""),
      html: (this.html || ""),
    };

    var mail = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + mail.messageId);
    return mail;
  },
};
