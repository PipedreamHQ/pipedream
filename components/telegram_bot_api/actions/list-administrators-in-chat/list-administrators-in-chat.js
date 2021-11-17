/* eslint-disable camelcase */
const telegram_bot_api = require("../../telegram_bot_api.app.js");

module.exports = {
  key: "telegram_bot_api-list-administrators-in-chat",
  name: "List Administrators In Chat",
  description: "Use this module to get a list of administrators in a chat",
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
    return await this.telegram_bot_api.getChatAdministrators(this.chatId);
  },
};
