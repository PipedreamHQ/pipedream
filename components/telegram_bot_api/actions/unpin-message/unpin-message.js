/* eslint-disable camelcase */
const telegramBotApi = require("../../telegram_bot_api.app.js");

module.exports = {
  key: "telegram_bot_api-unpin-message",
  name: "Unpin a Message",
  description: "Unpins a message",
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
    messageId: {
      propDefinition: [
        telegramBotApi,
        "messageId",
      ],
    },
  },
  async run() {
    return await this.telegramBotApi.unpinChatMessage(this.chatId, this.messageId);
  },
};
