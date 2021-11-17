/* eslint-disable camelcase */
const telegram_bot_api = require("../../telegram_bot_api.app.js");

module.exports = {
  key: "telegram_bot_api-edit-text-message",
  name: "Edit a Text Message",
  description: "Edits text or game messages",
  version: "0.0.1",
  type: "action",
  props: {
    telegram_bot_api,
    chatId: {
      propDefinition: [
        telegram_bot_api,
        "chatId",
      ],
    },
    messageId: {
      propDefinition: [
        telegram_bot_api,
        "messageId",
      ],
    },
    text: {
      propDefinition: [
        telegram_bot_api,
        "text",
      ],
    },
    disable_notification: {
      propDefinition: [
        telegram_bot_api,
        "disable_notification",
      ],
    },
  },
  async run() {
    return await this.telegram_bot_api.editMessageText(this.text, {
      chatId: this.chatId,
      messageId: this.messageId,
      disable_notification: this.disable_notification,
    });
  },
};
