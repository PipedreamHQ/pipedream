/* eslint-disable camelcase */
const telegram_bot_api = require("../../telegram_bot_api.app.js");
const contentTypes = require("../../content-types");

module.exports = {
  key: "telegram_bot_api-send-document-or-image",
  name: "Send a Document/Image",
  description: "Sends a document or an image to your Telegram Desktop application",
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
      description: "Enter the file caption.",
    },
    filename: {
      propDefinition: [
        telegram_bot_api,
        "filename",
      ],
    },
    doc: {
      propDefinition: [
        telegram_bot_api,
        "media",
      ],
      label: "Document or Image",
    },
    parse_mode: {
      propDefinition: [
        telegram_bot_api,
        "parse_mode",
      ],
    },
    contentType: {
      propDefinition: [
        telegram_bot_api,
        "contentType",
      ],
      options: contentTypes.all,
    },
    disable_notification: {
      propDefinition: [
        telegram_bot_api,
        "disable_notification",
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
    return await this.telegram_bot_api.sendDocument(this.chatId, this.doc, {
      caption: this.caption,
      parse_mode: this.parse_mode,
      disable_notification: this.disable_notification,
      reply_to_message_id: this.reply_to_message_id,
      reply_markup: this.reply_markup,
      filename: this.filename,
      contentType: this.contentType,
    });
  },
};
