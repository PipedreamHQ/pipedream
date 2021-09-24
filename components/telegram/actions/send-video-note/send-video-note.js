const telegram = require("../../telegram.app.js");
const contentTypes = require("../../content-types");

module.exports = {
  key: "telegram-send-video-note",
  name: "Send a Video Note",
  description: "As of v.4.0, Telegram clients support rounded square mp4 videos of up to 1 minute long. Use this method to send video messages",
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
    filename: {
      propDefinition: [
        telegram,
        "filename",
      ],
    },
    videoNote: {
      propDefinition: [
        telegram,
        "media",
      ],
      label: "Video Note",
    },
    contentType: {
      propDefinition: [
        telegram,
        "contentType",
      ],
      options: contentTypes.video,
    },
    length: {
      propDefinition: [
        telegram,
        "length",
      ],
    },
    duration: {
      propDefinition: [
        telegram,
        "duration",
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
    return await this.telegram.sendVideoNote(this.chatId, this.videoNote, {
      length: this.length,
      duration: this.duration,
      reply_to_message_id: this.reply_to_message_id,
      reply_markup: this.reply_markup,
    }, {
      filename: this.filename,
      contentType: this.contentType,
    });
  },
};
