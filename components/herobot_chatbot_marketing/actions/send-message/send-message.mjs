import app from "../../herobot_chatbot_marketing.app.mjs";

export default {
  key: "herobot_chatbot_marketing-send-message",
  name: "Send Message",
  description: "Sends a message to a user through the chatbot. [See the documentation](https://my.herobot.app/api/swagger/#/Users/sendTextMessage)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message content to send to the user.",
    },
    channel: {
      type: "string",
      label: "Channel",
      description: "The channel you want to contact the user by.",
      options: [
        {
          label: "Facebook Messenger",
          value: "messenger",
        },
        {
          label: "WhatsApp",
          value: "whatsapp",
        },
        {
          label: "Instagram",
          value: "instagram",
        },
        {
          label: "Google BM",
          value: "googleBM",
        },
        {
          label: "Web Chatbot",
          value: "webchat",
        },
        {
          label: "SMS",
          value: "sms",
        },
        {
          label: "Voice",
          value: "voice",
        },
        {
          label: "Telegram",
          value: "telegram",
        },
        {
          label: "Viber",
          value: "viber",
        },
        {
          label: "Email",
          value: "smtp",
        },
      ],
      default: "webchat",
    },
  },
  async run({ $ }) {
    const response = await this.app.sendMessage({
      $,
      userId: this.userId,
      data: {
        text: this.message,
        channel: this.channel,
      },
    });
    $.export("$summary", `Successfully sent message to user ID ${this.userId}`);
    return response;
  },
};
