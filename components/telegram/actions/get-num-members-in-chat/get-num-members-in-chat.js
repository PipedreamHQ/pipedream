const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-get-num-members-in-chat",
  name: "Get the Number of Members in a Chat",
  description: "Use this module to get the number of members in a chat",
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
    return await this.telegram.getChatMemberCount(this.chatId);
  },
};
