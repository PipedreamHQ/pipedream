const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-unpin-message",
  name: "Unpin a Message",
  description: "Unpins a message",
  version: "0.0.1",
  type: "action",
  props: {
    telegram,
    chatId: {
      propDefinition: [
        telegram,
        "chatId",
      ],
    },
    messageId: {
      propDefinition: [
        telegram,
        "messageId",
      ],
    },
  },
  async run() {
    return await this.telegram.unpinChatMessage(this.chatId, this.messageId);
  },
};
