/* eslint-disable camelcase */
const telegram_bot_api = require("../../telegram_bot_api.app.js");

module.exports = {
  key: "telegram_bot_api-unpin-message",
  name: "Unpin a Message",
  description: "Unpins a message",
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
  },
  async run() {
    return await this.telegram_bot_api.unpinChatMessage(this.chatId, this.messageId);
  },
};
