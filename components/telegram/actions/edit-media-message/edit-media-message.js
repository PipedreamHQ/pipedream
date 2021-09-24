const {
  TELEGRAM_BOT_API_MEDIA_PHOTO,
  TELEGRAM_BOT_API_MEDIA_VIDEO,
} = require("../../constants.js");
const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-edit-media-message",
  name: "Edit a Media Message",
  description: "Edits photo or video messages",
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
    messageId: {
      propDefinition: [
        telegram,
        "messageId",
      ],
    },
    type: {
      propDefinition: [
        telegram,
        "type",
      ],
      options: [
        {
          label: "Photo",
          value: TELEGRAM_BOT_API_MEDIA_PHOTO,
        },
        {
          label: "Video",
          value: TELEGRAM_BOT_API_MEDIA_VIDEO,
        },
      ],
    },
    caption: {
      propDefinition: [
        telegram,
        "caption",
      ],
    },
    filename: {
      propDefinition: [
        telegram,
        "filename",
      ],
    },
    media: {
      propDefinition: [
        telegram,
        "media",
      ],
      description: "",
    },
    parse_mode: {
      propDefinition: [
        telegram,
        "parse_mode",
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
    return await this.telegram.editMessageMedia({
      type: this.type,
      media: this.media,
      caption: this.caption,
      parse_mode: this.parse_mode,
    }, {
      chatId: this.chatId,
      messageId: this.messageId,
    });
  },
};
