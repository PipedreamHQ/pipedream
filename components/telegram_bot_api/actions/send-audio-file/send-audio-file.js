/* eslint-disable camelcase */
const telegram_bot_api = require("../../telegram_bot_api.app.js");
const contentTypes = require("../../content-types");

module.exports = {
  key: "telegram_bot_api-send-audio-file",
  name: "Send an Audio File",
  description: "Sends an audio file to your Telegram Desktop application",
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
      description: "Enter the audio caption.",
    },
    filename: {
      propDefinition: [
        telegram_bot_api,
        "filename",
      ],
    },
    audio: {
      propDefinition: [
        telegram_bot_api,
        "media",
      ],
      label: "Audio",
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
    duration: {
      propDefinition: [
        telegram_bot_api,
        "duration",
      ],
      description: "Enter duration of sent audio in seconds.",
    },
    performer: {
      propDefinition: [
        telegram_bot_api,
        "performer",
      ],
    },
    title: {
      propDefinition: [
        telegram_bot_api,
        "title",
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
      options: contentTypes.audio,
    },
  },
  async run() {
    return await this.telegram_bot_api.sendAudio(this.chatId, this.audio, {
      caption: this.caption,
      parse_mode: this.parse_mode,
      disable_notification: this.disable_notification,
      duration: this.duration,
      performer: this.performer,
      title: this.title,
      reply_markup: this.reply_markup,
      filename: this.filename,
      contentType: this.contentType,
    });
  },
};
