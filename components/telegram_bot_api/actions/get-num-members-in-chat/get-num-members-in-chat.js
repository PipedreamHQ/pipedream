/* eslint-disable camelcase */
const telegram_bot_api = require("../../telegram_bot_api.app.js");

module.exports = {
  key: "telegram_bot_api-get-num-members-in-chat",
  name: "Get the Number of Members in a Chat",
  description: "Use this module to get the number of members in a chat",
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
  },
  async run() {
    return await this.telegram_bot_api.getChatMemberCount(this.chatId);
  },
};
