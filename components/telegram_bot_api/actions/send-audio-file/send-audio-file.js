/* eslint-disable camelcase */
const telegramBotApi = require("../../telegram_bot_api.app.js");
const contentTypes = require("../../content-types");

module.exports = {
  key: "telegram_bot_api-send-audio-file",
  name: "Send an Audio File",
  description: "Sends an audio file to your Telegram Desktop application. [See the docs](https://core.telegram.org/bots/api#sendaudio) for more information",
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
      description: "Enter the audio caption.",
    },
    filename: {
      propDefinition: [
        telegramBotApi,
        "filename",
      ],
    },
    audio: {
      propDefinition: [
        telegramBotApi,
        "media",
      ],
      label: "Audio",
    },
    parse_mode: {
      propDefinition: [
        telegramBotApi,
        "parse_mode",
      ],
    },
    disable_notification: {
      propDefinition: [
        telegramBotApi,
        "disable_notification",
      ],
    },
    duration: {
      propDefinition: [
        telegramBotApi,
        "duration",
      ],
      description: "Enter duration of sent audio in seconds.",
    },
    performer: {
      propDefinition: [
        telegramBotApi,
        "performer",
      ],
    },
    title: {
      propDefinition: [
        telegramBotApi,
        "title",
      ],
    },
    reply_markup: {
      propDefinition: [
        telegramBotApi,
        "reply_markup",
      ],
    },
    contentType: {
      propDefinition: [
        telegramBotApi,
        "contentType",
      ],
      options: contentTypes.audio,
    },
  },
  async run() {
    return await this.telegramBotApi.sendAudio(this.chatId, this.audio, {
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
