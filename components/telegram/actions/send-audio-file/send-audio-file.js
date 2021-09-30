const telegram = require("../../telegram.app.js");
const contentTypes = require("../../content-types");

module.exports = {
  key: "telegram-send-audio-file",
  name: "Send an Audio File",
  description: "Sends an audio file to your Telegram Desktop application",
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
      description: "Enter the audio caption.",
    },
    filename: {
      propDefinition: [
        telegram,
        "filename",
      ],
    },
    audio: {
      propDefinition: [
        telegram,
        "media",
      ],
      label: "Audio",
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
    duration: {
      propDefinition: [
        telegram,
        "duration",
      ],
      description: "Enter duration of sent audio in seconds.",
    },
    performer: {
      propDefinition: [
        telegram,
        "performer",
      ],
    },
    title: {
      propDefinition: [
        telegram,
        "title",
      ],
    },
    reply_markup: {
      propDefinition: [
        telegram,
        "reply_markup",
      ],
    },
    contentType: {
      propDefinition: [
        telegram,
        "contentType",
      ],
      options: contentTypes.audio,
    },
  },
  async run() {
    return await this.telegram.sendAudio(this.chatId, this.audio, {
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
