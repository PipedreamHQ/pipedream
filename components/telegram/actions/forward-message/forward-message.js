const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-forward-message",
  name: "Forward a Message",
  description: "Forwards messages of any kind",
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
    fromChatId: {
      propDefinition: [
        telegram,
        "fromChatId",
      ],
    },
    messageId: {
      propDefinition: [
        telegram,
        "messageId",
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
    return await this.telegram.forwardMessage(
      this.chatId,
      this.fromChatId,
      this.messageId,
      {
        disable_notification: this.disable_notification,
      },
    );
  },
};
