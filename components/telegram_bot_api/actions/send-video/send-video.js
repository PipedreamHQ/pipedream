/* eslint-disable camelcase */
const telegram_bot_api = require("../../telegram_bot_api.app.js");
const contentTypes = require("../../content-types");

module.exports = {
  key: "telegram_bot_api-send-video",
  name: "Send a Video",
  description: "Sends a video file to your Telegram Desktop application",
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
      description: "Enter the video caption.",
    },
    filename: {
      propDefinition: [
        telegram_bot_api,
        "filename",
      ],
    },
    video: {
      propDefinition: [
        telegram_bot_api,
        "media",
      ],
      label: "Video",
    },
    contentType: {
      propDefinition: [
        telegram_bot_api,
        "contentType",
      ],
      options: contentTypes.video,
    },
    duration: {
      propDefinition: [
        telegram_bot_api,
        "duration",
      ],
    },
    width: {
      propDefinition: [
        telegram_bot_api,
        "width",
      ],
    },
    height: {
      propDefinition: [
        telegram_bot_api,
        "height",
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
    return await this.telegram_bot_api.sendVideo(this.chatId, this.video, {
      caption: this.caption,
      parse_mode: this.parse_mode,
      disable_notification: this.disable_notification,
      duration: this.duration,
      width: this.width,
      height: this.height,
      reply_markup: this.reply_markup,
      filename: this.filename,
      contentType: this.contentType,
    });
  },
};
