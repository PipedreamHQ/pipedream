/* eslint-disable camelcase */
const telegram_bot_api = require("../../telegram_bot_api.app.js");

module.exports = {
  key: "telegram_bot_api-send-sticker",
  name: "Send a Sticker",
  description: "Sends a .webp sticker to you Telegram Desktop application",
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
    filename: {
      propDefinition: [
        telegram_bot_api,
        "filename",
      ],
    },
    sticker: {
      propDefinition: [
        telegram_bot_api,
        "media",
      ],
      label: "Sticker",
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
    return await this.telegram_bot_api.sendSticker(this.chatId, this.sticker, {
      reply_to_message_id: this.reply_to_message_id,
      reply_markup: this.reply_markup,
      filename: this.filename,
    });
  },
};
