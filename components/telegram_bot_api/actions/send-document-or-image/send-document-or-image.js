/* eslint-disable camelcase */
const telegramBotApi = require("../../telegram_bot_api.app.js");
const contentTypes = require("../../content-types");

module.exports = {
  key: "telegram_bot_api-send-document-or-image",
  name: "Send a Document/Image",
  description: "Sends a document or an image to your Telegram Desktop application",
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
    caption: {
      propDefinition: [
        telegramBotApi,
        "caption",
      ],
      description: "Enter the file caption.",
    },
    filename: {
      propDefinition: [
        telegramBotApi,
        "filename",
      ],
    },
    doc: {
      propDefinition: [
        telegramBotApi,
        "media",
      ],
      label: "Document or Image",
    },
    parse_mode: {
      propDefinition: [
        telegramBotApi,
        "parse_mode",
      ],
    },
    contentType: {
      propDefinition: [
        telegramBotApi,
        "contentType",
      ],
      options: contentTypes.all,
    },
    disable_notification: {
      propDefinition: [
        telegramBotApi,
        "disable_notification",
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
    return await this.telegramBotApi.sendDocument(this.chatId, this.doc, {
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
