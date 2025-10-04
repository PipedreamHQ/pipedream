import sendbird from "../../sendbird_ai_chabot.app.mjs";

export default {
  key: "sendbird_ai_chabot-send-bot-message",
  name: "Send Bot Message",
  description: "Sends a bot message to a group channel. [See the documentation](https://sendbird.com/docs/chat/platform-api/v3/bot/sending-a-bot-message/send-a-bot-message)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sendbird,
    botId: {
      propDefinition: [
        sendbird,
        "botId",
      ],
    },
    channelUrl: {
      propDefinition: [
        sendbird,
        "channelUrl",
      ],
    },
    message: {
      type: "string",
      label: "Message",
      description: "Specifies the content of the message sent by the bot",
    },
  },
  async run({ $ }) {
    const response = await this.sendbird.sendBotMessage({
      $,
      botId: this.botId,
      data: {
        channel_url: this.channelUrl,
        message: this.message,
      },
    });
    if (response?.message?.message_id) {
      $.export("$summary", `Successfully sent message with ID: ${response.message.message_id}`);
    }
    return response;
  },
};
