import telegramBotApi from "../../telegram_bot_api.app.mjs";
import { TELEGRAM_BOT_API_UI_MEDIA_TYPES } from "../../common/constants.mjs";

export default {
  key: "telegram_bot_api-send-media-by-url-or-id",
  name: "Send Media by URL or ID",
  description: "Sends a file (document, photo, video, audio, ...) by HTTP URL or by ID that exists on the Telegram servers. [See the docs](https://core.telegram.org/bots/api#inputmedia) for more information",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    },
    mediaType: {
      propDefinition: [
        telegramBotApi,
        "type",
      ],
      options: TELEGRAM_BOT_API_UI_MEDIA_TYPES,
    },
    media: {
      propDefinition: [
        telegramBotApi,
        "media",
      ],
      label: "Media",
      description: "Pass a file_id to send a file that exists on the Telegram servers or pass an HTTP URL for Telegram to get a file from the Internet. File must meet Telegram's [requirements](https://core.telegram.org/bots/api#sending-files) for MIME type and size.",
    },
    disable_notification: {
      propDefinition: [
        telegramBotApi,
        "disable_notification",
      ],
    },
    reply_to_message_id: {
      propDefinition: [
        telegramBotApi,
        "reply_to_message_id",
      ],
    },
    reply_markup: {
      propDefinition: [
        telegramBotApi,
        "reply_markup",
      ],
    },
  },
  async run({ $ }) {
    const resp = await this.telegramBotApi.sendMediaByType(
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
    $.export("$summary", `Successfully sent the media file to chat, "${this.chatId}"`);
    return resp;
  },
};
