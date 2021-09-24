const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-delete-message",
  name: "Delete a Message",
  description: "Deletes a message",
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
    return await this.telegram.deleteMessage(this.chatId, this.messageId);
  },
};
