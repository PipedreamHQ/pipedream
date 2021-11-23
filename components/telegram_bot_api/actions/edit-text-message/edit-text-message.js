/* eslint-disable camelcase */
const telegramBotApi = require("../../telegram_bot_api.app.js");

module.exports = {
  key: "telegram_bot_api-edit-text-message",
  name: "Edit a Text Message",
  description: "Edits text or game messages. [See the docs](https://core.telegram.org/bots/api#editmessagetext) for more information",
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
    text: {
      propDefinition: [
        telegramBotApi,
        "text",
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
    return await this.telegramBotApi.editMessageText(this.text, {
      chatId: this.chatId,
      messageId: this.messageId,
      disable_notification: this.disable_notification,
    });
  },
};
