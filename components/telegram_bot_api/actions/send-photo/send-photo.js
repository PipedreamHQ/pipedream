/* eslint-disable camelcase */
const telegram_bot_api = require("../../telegram_bot_api.app.js");
const contentTypes = require("../../content-types");

module.exports = {
  key: "telegram_bot_api-send-photo",
  name: "Send a Photo",
  description: "Sends a photo to your Telegram Desktop application",
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
    caption: {
      propDefinition: [
        telegram_bot_api,
        "caption",
      ],
      description: "Enter the photo caption.",
    },
    filename: {
      propDefinition: [
        telegram_bot_api,
        "filename",
      ],
    },
    photo: {
      propDefinition: [
        telegram_bot_api,
        "media",
      ],
      label: "Photo",
    },
    disable_notification: {
      propDefinition: [
        telegram_bot_api,
        "disable_notification",
      ],
    },
    parse_mode: {
      propDefinition: [
        telegram_bot_api,
        "parse_mode",
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
    contentType: {
      propDefinition: [
        telegram_bot_api,
        "contentType",
      ],
      options: contentTypes.image,
    },
  },
  async run() {
    return await this.telegram_bot_api.sendPhoto(this.chatId, this.photo, {
      caption: this.caption,
      disable_notification: this.disable_notification,
      parse_mode: this.parse_mode,
      reply_to_message_id: this.reply_to_message_id,
      reply_markup: this.reply_markup,
      filename: this.filename,
      contentType: this.contentType,
    });
  },
};
