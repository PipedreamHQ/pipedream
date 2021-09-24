const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-list-administrators-in-chat",
  name: "List Administrators In Chat",
  description: "Use this module to get a list of administrators in a chat",
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
  },
  async run() {
    return await this.telegram.getChatAdministrators(this.chatId);
  },
};
