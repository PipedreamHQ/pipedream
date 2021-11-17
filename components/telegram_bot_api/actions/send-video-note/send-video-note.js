/* eslint-disable camelcase */
const telegram_bot_api = require("../../telegram_bot_api.app.js");
const contentTypes = require("../../content-types");

module.exports = {
  key: "telegram_bot_api-send-video-note",
  name: "Send a Video Note",
  description: "As of v.4.0, Telegram clients support rounded square mp4 videos of up to 1 minute long. Use this method to send video messages",
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
    videoNote: {
      propDefinition: [
        telegram_bot_api,
        "media",
      ],
      label: "Video Note",
    },
    contentType: {
      propDefinition: [
        telegram_bot_api,
        "contentType",
      ],
      options: contentTypes.video,
    },
    length: {
      propDefinition: [
        telegram_bot_api,
        "length",
      ],
    },
    duration: {
      propDefinition: [
        telegram_bot_api,
        "duration",
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
    return await this.telegram_bot_api.sendVideoNote(this.chatId, this.videoNote, {
      length: this.length,
      duration: this.duration,
      reply_to_message_id: this.reply_to_message_id,
      reply_markup: this.reply_markup,
      filename: this.filename,
      contentType: this.contentType,
    });
  },
};
