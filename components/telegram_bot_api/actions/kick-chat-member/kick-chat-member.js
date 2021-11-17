/* eslint-disable camelcase */
const telegram_bot_api = require("../../telegram_bot_api.app.js");

module.exports = {
  key: "telegram_bot_api-kick-chat-member",
  name: "Kick a Chat Member",
  description: "Use this method to kick a user from a group, a supergroup or channel",
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
    userId: {
      propDefinition: [
        telegram_bot_api,
        "userId",
      ],
    },
    until_date: {
      propDefinition: [
        telegram_bot_api,
        "until_date",
      ],
      description: "Enter the date when the user will be unbanned, in [unix time](https://en.wikipedia.org/wiki/Unix_time) (e.g. `1567780450`).",
    },
  },
  async run() {
    return await this.telegram_bot_api.banChatMember(this.chatId, this.userId, {
      until_date: this.until_date,
    });
  },
};
