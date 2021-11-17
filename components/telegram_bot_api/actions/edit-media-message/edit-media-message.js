const {
  TELEGRAM_BOT_API_MEDIA_PHOTO,
  TELEGRAM_BOT_API_MEDIA_VIDEO,
} = require("../../constants.js");
/* eslint-disable camelcase */
const telegram_bot_api = require("../../telegram_bot_api.app.js");

module.exports = {
  key: "telegram_bot_api-edit-media-message",
  name: "Edit a Media Message",
  description: "Edits photo or video messages",
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
    messageId: {
      propDefinition: [
        telegram_bot_api,
        "messageId",
      ],
    },
    type: {
      propDefinition: [
        telegram_bot_api,
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
        telegram_bot_api,
        "caption",
      ],
    },
    filename: {
      propDefinition: [
        telegram_bot_api,
        "filename",
      ],
    },
    media: {
      propDefinition: [
        telegram_bot_api,
        "media",
      ],
      label: "Media",
    },
    parse_mode: {
      propDefinition: [
        telegram_bot_api,
        "parse_mode",
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
    return await this.telegram_bot_api.editMessageMedia({
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
