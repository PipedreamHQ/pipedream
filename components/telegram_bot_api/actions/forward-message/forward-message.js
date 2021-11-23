/* eslint-disable camelcase */
const telegramBotApi = require("../../telegram_bot_api.app.js");

module.exports = {
  key: "telegram_bot_api-forward-message",
  name: "Forward a Message",
  description: "Forwards messages of any kind",
  version: "0.0.1",
  type: "action",
  props: {
    telegramBotApi,
    chatId: {
      propDefinition: [
        telegramBotApi,
        "chatId",
      ],
    },
    fromChatId: {
      propDefinition: [
        telegramBotApi,
        "fromChatId",
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
  async run() {
    return await this.telegramBotApi.forwardMessage(
      this.chatId,
      this.fromChatId,
      this.messageId,
      {
        disable_notification: this.disable_notification,
      },
    );
  },
};
