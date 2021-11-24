/* eslint-disable camelcase */
const telegramBotApi = require("../../telegram_bot_api.app.js");

module.exports = {
  key: "telegram_bot_api-unpin-message",
  name: "Unpin a Message",
  description: "Unpins a message. [See the docs](https://core.telegram.org/bots/api#unpinchatmessage) for more information",
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
    messageId: {
      propDefinition: [
        telegramBotApi,
        "messageId",
      ],
    },
  },
  async run({ $ }) {
    const resp = await this.telegramBotApi.unpinChatMessage(this.chatId, this.messageId);
    $.export("$summary", `Successfully unpinned the message from chat, "${this.chatId}"`);
    return resp;
  },
};
