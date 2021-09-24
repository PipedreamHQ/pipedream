const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-pin-message",
  name: "Pin a Message",
  description: "Pins a message",
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
    disable_notification: {
      propDefinition: [
        telegram,
        "disable_notification",
      ],
    },
  },
  async run() {
    return await this.telegram.pinChatMessage(this.chatId, this.messageId, {
      disable_notification: this.disable_notification,
    });
  },
};
