const telegram = require("../../telegram.app.js");
const contentTypes = require("../../content-types");

module.exports = {
  key: "telegram-send-document-or-image",
  name: "Send a Document/Image",
  description: "Sends a document or an image to your Telegram Desktop application",
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
    caption: {
      propDefinition: [
        telegram,
        "caption",
      ],
      description: "Enter the file caption.",
    },
    filename: {
      propDefinition: [
        telegram,
        "filename",
      ],
    },
    doc: {
      propDefinition: [
        telegram,
        "media",
      ],
      label: "Document or Image",
    },
    parse_mode: {
      propDefinition: [
        telegram,
        "parse_mode",
      ],
    },
    contentType: {
      propDefinition: [
        telegram,
        "contentType",
      ],
      options: contentTypes.all,
    },
    disable_notification: {
      propDefinition: [
        telegram,
        "disable_notification",
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
    return await this.telegram.sendDocument(this.chatId, this.doc, {
      caption: this.caption,
      parse_mode: this.parse_mode,
      disable_notification: this.disable_notification,
      reply_to_message_id: this.reply_to_message_id,
      reply_markup: this.reply_markup,
    }, {
      filename: this.filename,
      contentType: this.contentType,
    });
  },
};
