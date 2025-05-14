import mailosaur from "../../mailosaur.app.mjs";

export default {
  key: "mailosaur-create-email",
  name: "Create and Send Email via Mailosaur",
  description: "Sends an email through Mailosaur. [See the documentation](https://mailosaur.com/docs/api)",
  version: "0.0.1",
  type: "action",
  props: {
    mailosaur,
    serverId: {
      propDefinition: [
        mailosaur,
        "serverId",
      ],
    },
    to: {
      propDefinition: [
        mailosaur,
        "to",
      ],
    },
    subject: {
      propDefinition: [
        mailosaur,
        "subject",
      ],
    },
    from: {
      propDefinition: [
        mailosaur,
        "from",
      ],
      optional: true,
    },
    html: {
      propDefinition: [
        mailosaur,
        "html",
      ],
      optional: true,
    },
    text: {
      propDefinition: [
        mailosaur,
        "text",
      ],
      optional: true,
    },
    send: {
      propDefinition: [
        mailosaur,
        "send",
      ],
      optional: true,
    },
    attachments: {
      propDefinition: [
        mailosaur,
        "attachments",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mailosaur.sendEmail({
      serverId: this.serverId,
      to: this.to,
      subject: this.subject,
      from: this.from,
      html: this.html,
      text: this.text,
      send: this.send,
      attachments: this.attachments
        ? this.attachments.map(JSON.parse)
        : undefined,
    });

    $.export("$summary", `Email sent successfully to ${this.to}`);
    return response;
  },
};
