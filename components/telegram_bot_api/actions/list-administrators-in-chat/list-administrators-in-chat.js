/* eslint-disable camelcase */
const telegramBotApi = require("../../telegram_bot_api.app.js");

module.exports = {
  key: "telegram_bot_api-list-administrators-in-chat",
  name: "List Administrators In Chat",
  description: "Use this module to get a list of administrators in a chat. [See the docs](https://core.telegram.org/bots/api#getchatadministrators) for more information",
  version: "0.0.1",
  type: "action",
  props: {
    telegramBotApi,
    chatId: {
      propDefinition: [
        telegramBotApi,
        "chatId",
      ],
    },
  },
  async run() {
    return await this.telegramBotApi.getChatAdministrators(this.chatId);
  },
};
