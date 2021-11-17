/* eslint-disable camelcase */
const telegram_bot_api = require("../../telegram_bot_api.app.js");
const contentTypes = require("../../content-types");

module.exports = {
  key: "telegram_bot_api-send-voice-message",
  name: "Send a Voice Message",
  description: "Sends a voice message",
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
      description: "Enter the voice message caption.",
    },
    filename: {
      propDefinition: [
        telegram_bot_api,
        "filename",
      ],
    },
    voice: {
      propDefinition: [
        telegram_bot_api,
        "media",
      ],
      label: "Voice Message",
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
    contentType: {
      propDefinition: [
        telegram_bot_api,
        "contentType",
      ],
      options: contentTypes.voice,
    },
    duration: {
      propDefinition: [
        telegram_bot_api,
        "duration",
      ],
      description: "Enter the duration of sent voice message in seconds.",
    },
    reply_markup: {
      propDefinition: [
        telegram_bot_api,
        "reply_markup",
      ],
    },
  },
  async run() {
    return await this.telegram_bot_api.sendAudio(this.chatId, this.voice, {
      caption: this.caption,
      parse_mode: this.parse_mode,
      disable_notification: this.disable_notification,
      duration: this.duration,
      reply_markup: this.reply_markup,
      filename: this.filename,
      contentType: this.contentType,
    });
  },
};
