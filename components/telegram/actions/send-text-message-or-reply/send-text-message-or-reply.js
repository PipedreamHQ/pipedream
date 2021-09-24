const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-send-text-message-or-reply",
  name: "Send a Text Message or Reply",
  description: "Sends a text message or a reply to your Telegram Desktop application",
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
    text: {
      propDefinition: [
        telegram,
        "text",
      ],
    },
    parse_mode: {
      propDefinition: [
        telegram,
        "parse_mode",
      ],
    },
    disable_notification: {
      propDefinition: [
        telegram,
        "disable_notification",
      ],
    },
    disable_web_page_preview: {
      propDefinition: [
        telegram,
        "disable_web_page_preview",
      ],
    },
    reply_to_message_id: {
      propDefinition: [
        telegram,
        "reply_to_message_id",
      ],
    },
    reply_markup: {
      propDefinition: [
        telegram,
        "reply_markup",
      ],
    },
  },
  async run() {
    return await this.telegram.sendMessage(this.chatId, this.text, {
      parse_mode: this.parse_mode,
      disable_notification: this.disable_notification,
      disable_web_page_preview: this.disable_web_page_preview,
      reply_to_message_id: this.reply_to_message_id,
      reply_markup: this.reply_markup,
    });
  },
};
