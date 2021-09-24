const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-kick-chat-member",
  name: "Kick a Chat Member",
  description: "Use this method to kick a user from a group, a supergroup or channel",
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
    userId: {
      propDefinition: [
        telegram,
        "userId",
      ],
    },
    until_date: {
      propDefinition: [
        telegram,
        "until_date",
      ],
      description: "Enter the date when the user will be unbanned, in [unix time](https://en.wikipedia.org/wiki/Unix_time) (e.g. `1567780450`).",
    },
  },
  async run() {
    return await this.telegram.banChatMember(this.chatId, this.userId, {
      until_date: this.until_date,
    });
  },
};
