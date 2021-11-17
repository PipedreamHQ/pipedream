/* eslint-disable camelcase */
const telegram_bot_api = require("../../telegram_bot_api.app.js");

module.exports = {
  key: "telegram_bot_api-forward-message",
  name: "Forward a Message",
  description: "Forwards messages of any kind",
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
    fromChatId: {
      propDefinition: [
        telegram_bot_api,
        "fromChatId",
      ],
    },
    messageId: {
      propDefinition: [
        telegram_bot_api,
        "messageId",
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
    return await this.telegram_bot_api.forwardMessage(
      this.chatId,
      this.fromChatId,
      this.messageId,
      {
        disable_notification: this.disable_notification,
      },
    );
  },
};
