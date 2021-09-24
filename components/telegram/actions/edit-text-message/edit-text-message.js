const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-edit-text-message",
  name: "Edit a Text Message",
  description: "Edits text or game messages",
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
    text: {
      propDefinition: [
        telegram,
        "text",
      ],
    },
    disable_notification: {
      propDefinition: [
        telegram,
        "disable_notification",
      ],
    },
  },
  async run() {
    return await this.telegram.editMessageText(this.text, {
      chatId: this.chatId,
      messageId: this.messageId,
      disable_notification: this.disable_notification,
    });
  },
};
