import app from "../../topmessage.app.mjs";

export default {
  key: "topmessage-send-message",
  name: "Send Message",
  description: "Send messages via Whatsapp or SMS. [See the documentation](https://topmessage.com/documentation-api/send-message)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    from: {
      propDefinition: [
        app,
        "from",
      ],
    },
    to: {
      propDefinition: [
        app,
        "to",
      ],
    },
    text: {
      propDefinition: [
        app,
        "text",
      ],
    },
    shortenURLs: {
      propDefinition: [
        app,
        "shortenURLs",
      ],
    },
    templateId: {
      propDefinition: [
        app,
        "templateId",
      ],
    },
    channel: {
      propDefinition: [
        app,
        "channel",
      ],
    },
    schedule: {
      propDefinition: [
        app,
        "schedule",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.sendMessage({
      $,
      data: {
        data: {
          from: this.from,
          to: this.to,
          text: this.text,
          shorten_URLs: this.shortenURLs,
          template_id: this.templateId,
          channel: this.channel,
          schedule: this.schedule,
        },
      },
    });
    $.export("$summary", "Successfully sent the message request");
    return response;
  },
};
