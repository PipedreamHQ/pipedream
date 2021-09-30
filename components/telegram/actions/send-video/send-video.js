const telegram = require("../../telegram.app.js");
const contentTypes = require("../../content-types");

module.exports = {
  key: "telegram-send-video",
  name: "Send a Video",
  description: "Sends a video file to your Telegram Desktop application",
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
      description: "Enter the video caption.",
    },
    filename: {
      propDefinition: [
        telegram,
        "filename",
      ],
    },
    video: {
      propDefinition: [
        telegram,
        "media",
      ],
      label: "Video",
    },
    contentType: {
      propDefinition: [
        telegram,
        "contentType",
      ],
      options: contentTypes.video,
    },
    duration: {
      propDefinition: [
        telegram,
        "duration",
      ],
    },
    width: {
      propDefinition: [
        telegram,
        "width",
      ],
    },
    height: {
      propDefinition: [
        telegram,
        "height",
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
    return await this.telegram.sendVideo(this.chatId, this.video, {
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
