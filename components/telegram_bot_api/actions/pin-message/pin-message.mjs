import telegramBotApi from "../../telegram_bot_api.app.mjs";

export default {
  key: "telegram_bot_api-pin-message",
  name: "Pin a Message",
  description: "Pins a message. [See the docs](https://core.telegram.org/bots/api#pinchatmessage) for more information",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    telegramBotApi,
    chatId: {
      propDefinition: [
        telegramBotApi,
        "chatId",
      ],
    },
    messageId: {
      propDefinition: [
        telegramBotApi,
        "messageId",
      ],
    },
    disable_notification: {
      propDefinition: [
        telegramBotApi,
        "disable_notification",
      ],
    },
  },
  async run({ $ }) {
    const resp = await this.telegramBotApi.pinChatMessage(this.chatId, this.messageId, {
      disable_notification: this.disable_notification,
    });
    $.export("$summary", `Successfully pinned the message in chat, "${this.chatId}"`);
    return resp;
  },
};
