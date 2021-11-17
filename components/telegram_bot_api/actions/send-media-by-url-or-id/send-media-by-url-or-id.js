/* eslint-disable camelcase */
const telegram_bot_api = require("../../telegram_bot_api.app.js");
const { TELEGRAM_BOT_API_UI_MEDIA_TYPES } = require("../../constants.js");

module.exports = {
  key: "telegram_bot_api-send-media-by-url-or-id",
  name: "Send Media by URL or ID",
  description: "Sends a file (document, photo, video, audio, ...) by HTTP URL or by ID that exists on the Telegram servers",
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
    },
    mediaType: {
      propDefinition: [
        telegram_bot_api,
        "type",
      ],
      options: TELEGRAM_BOT_API_UI_MEDIA_TYPES,
    },
    media: {
      propDefinition: [
        telegram_bot_api,
        "media",
      ],
      label: "Media",
      description: "Pass a file_id to send a file that exists on the Telegram servers or pass an HTTP URL for Telegram to get a file from the Internet. File must meet Telegram's [requirements](https://core.telegram.org/bots/api#sending-files) for MIME type and size.",
    },
    disable_notification: {
      propDefinition: [
        telegram_bot_api,
        "disable_notification",
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
    return await this.telegram_bot_api.sendMediaByType(
      this.mediaType,
      this.chatId,
      this.media,
      {
        caption: this.caption,
        disable_notification: this.disable_notification,
        reply_to_message_id: this.reply_to_message_id,
        reply_markup: this.reply_markup,
      },
    );
  },
};
