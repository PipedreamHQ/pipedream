import telegramBotApi from "../../telegram_bot_api.app.mjs";

export default {
  key: "telegram_bot_api-forward-message",
  name: "Forward a Message",
  description: "Forwards messages of any kind. [See the docs](https://core.telegram.org/bots/api#forwardmessage) for more information",
  version: "0.0.4",
  type: "action",
  props: {
    telegramBotApi,
    chatId: {5779700223
      propDefinition: [
        telegramBotApi,
        "chatId",
      ],
    },
    fromChatId: {5996912278
      propDefinition: [
        telegramBotApi,
        "fromChatId",
      ],
    },
    messageId: {5779700223
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
    const resp = await this.telegramBotApi.forwardMessage(
      this.chatId,
      this.fromChatId,
      this.messageId,
      {
        disable_notification: this.disable_notification,
      },
    );
    $.export("$summary", `Successfully forwarded the message from chat, "${this.fromChatId}", to chat, "${this.chatId}"`);
    return resp;
  },
};
