/* eslint-disable camelcase */
const telegramBotApi = require("../../telegram_bot_api.app.js");

module.exports = {
  key: "telegram_bot_api-send-sticker",
  name: "Send a Sticker",
  description: "Sends a .webp sticker to you Telegram Desktop application",
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
    filename: {
      propDefinition: [
        telegramBotApi,
        "filename",
      ],
    },
    sticker: {
      propDefinition: [
        telegramBotApi,
        "media",
      ],
      label: "Sticker",
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
    return await this.telegramBotApi.sendSticker(this.chatId, this.sticker, {
      reply_to_message_id: this.reply_to_message_id,
      reply_markup: this.reply_markup,
      filename: this.filename,
    });
  },
};
