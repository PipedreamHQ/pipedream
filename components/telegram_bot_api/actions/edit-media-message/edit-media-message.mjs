import {
  TELEGRAM_BOT_API_MEDIA_PHOTO,
  TELEGRAM_BOT_API_MEDIA_VIDEO,
} from "../../common/constants.mjs";
import telegramBotApi from "../../telegram_bot_api.app.mjs";

export default {
  key: "telegram_bot_api-edit-media-message",
  name: "Edit a Media Message",
  description: "Edits photo or video messages. [See the docs](https://core.telegram.org/bots/api#editmessagemedia) for more information",
  version: "0.0.7",
  annotations: {
    destructiveHint: true,
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
    messageId: {
      propDefinition: [
        telegramBotApi,
        "messageId",
      ],
    },
    type: {
      propDefinition: [
        telegramBotApi,
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
        telegramBotApi,
        "caption",
      ],
    },
    filename: {
      propDefinition: [
        telegramBotApi,
        "filename",
      ],
    },
    media: {
      propDefinition: [
        telegramBotApi,
        "media",
      ],
      label: "Media",
    },
    parse_mode: {
      propDefinition: [
        telegramBotApi,
        "parse_mode",
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
    const resp = await this.telegramBotApi.editMessageMedia({
      type: this.type,
      media: this.media,
      caption: this.caption,
      parse_mode: this.parse_mode,
    }, {
      chatId: this.chatId,
      messageId: this.messageId,
      reply_markup: this.reply_markup,
    });
    $.export("$summary", `Successfully edited the ${this.type || "media"} message in chat, "${this.chatId}"`);
    return resp;
  },
};
