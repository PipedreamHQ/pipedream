/* eslint-disable camelcase */
const telegramBotApi = require("../../telegram_bot_api.app.js");

module.exports = {
  key: "telegram_bot_api-delete-message",
  name: "Delete a Message",
  description: "Deletes a message. [See the docs](https://core.telegram.org/bots/api#deletemessage) for more information",
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
    return await this.telegramBotApi.deleteMessage(this.chatId, this.messageId);
  },
};
