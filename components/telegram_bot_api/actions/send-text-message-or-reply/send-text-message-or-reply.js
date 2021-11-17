/* eslint-disable camelcase */
const telegram_bot_api = require("../../telegram_bot_api.app.js");

module.exports = {
  key: "telegram_bot_api-send-text-message-or-reply",
  name: "Send a Text Message or Reply",
  description: "Sends a text message or a reply to your Telegram Desktop application",
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
    text: {
      propDefinition: [
        telegram_bot_api,
        "text",
      ],
    },
    parse_mode: {
      propDefinition: [
        telegram_bot_api,
        "parse_mode",
      ],
    },
    disable_notification: {
      propDefinition: [
        telegram_bot_api,
        "disable_notification",
      ],
    },
    disable_web_page_preview: {
      propDefinition: [
        telegram_bot_api,
        "disable_web_page_preview",
      ],
    },
    reply_to_message_id: {
      propDefinition: [
        telegram_bot_api,
        "reply_to_message_id",
      ],
    },
    reply_markup: {
      propDefinition: [
        telegram_bot_api,
        "reply_markup",
      ],
    },
  },
  async run() {
    return await this.telegram_bot_api.sendMessage(this.chatId, this.text, {
      parse_mode: this.parse_mode,
      disable_notification: this.disable_notification,
      disable_web_page_preview: this.disable_web_page_preview,
      reply_to_message_id: this.reply_to_message_id,
      reply_markup: this.reply_markup,
    });
  },
};
