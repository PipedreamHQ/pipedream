/* eslint-disable camelcase */
const telegram_bot_api = require("../../telegram_bot_api.app.js");

module.exports = {
  key: "telegram_bot_api-pin-message",
  name: "Pin a Message",
  description: "Pins a message",
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
    disable_notification: {
      propDefinition: [
        telegram_bot_api,
        "disable_notification",
      ],
    },
  },
  async run() {
    return await this.telegram_bot_api.pinChatMessage(this.chatId, this.messageId, {
      disable_notification: this.disable_notification,
    });
  },
};
