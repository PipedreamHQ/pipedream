/* eslint-disable camelcase */
const telegramBotApi = require("../../telegram_bot_api.app.js");

module.exports = {
  key: "telegram_bot_api-send-text-message-or-reply",
  name: "Send a Text Message or Reply",
  description: "Sends a text message or a reply to your Telegram Desktop application. [See the docs](https://core.telegram.org/bots/api#sendmessage) for more information",
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
    text: {
      propDefinition: [
        telegramBotApi,
        "text",
      ],
    },
    parse_mode: {
      propDefinition: [
        telegramBotApi,
        "parse_mode",
      ],
    },
    disable_notification: {
      propDefinition: [
        telegramBotApi,
        "disable_notification",
      ],
    },
    disable_web_page_preview: {
      propDefinition: [
        telegramBotApi,
        "disable_web_page_preview",
      ],
    },
    reply_to_message_id: {
      propDefinition: [
        telegramBotApi,
        "reply_to_message_id",
      ],
    },
    reply_markup: {
      propDefinition: [
        telegramBotApi,
        "reply_markup",
      ],
    },
  },
  async run() {
    return await this.telegramBotApi.sendMessage(this.chatId, this.text, {
      parse_mode: this.parse_mode,
      disable_notification: this.disable_notification,
      disable_web_page_preview: this.disable_web_page_preview,
      reply_to_message_id: this.reply_to_message_id,
      reply_markup: this.reply_markup,
    });
  },
};
