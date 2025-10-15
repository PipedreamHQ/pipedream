import telegramBotApi from "../../telegram_bot_api.app.mjs";
import contentTypes from "../../common/content-types.mjs";

export default {
  key: "telegram_bot_api-send-photo",
  name: "Send a Photo",
  description: "Sends a photo to your Telegram Desktop application. [See the docs](https://core.telegram.org/bots/api#sendphoto) for more information",
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
      description: "Enter the photo caption.",
    },
    filename: {
      propDefinition: [
        telegramBotApi,
        "filename",
      ],
    },
    photo: {
      propDefinition: [
        telegramBotApi,
        "media",
      ],
      label: "Photo",
    },
    disable_notification: {
      propDefinition: [
        telegramBotApi,
        "disable_notification",
      ],
    },
    parse_mode: {
      propDefinition: [
        telegramBotApi,
        "parse_mode",
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
    contentType: {
      propDefinition: [
        telegramBotApi,
        "contentType",
      ],
      options: contentTypes.image,
    },
  },
  async run({ $ }) {
    const resp = await this.telegramBotApi.sendPhoto(this.chatId, this.photo, {
      caption: this.caption,
      disable_notification: this.disable_notification,
      parse_mode: this.parse_mode,
      reply_to_message_id: this.reply_to_message_id,
      reply_markup: this.reply_markup,
      filename: this.filename,
      contentType: this.contentType,
    });
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully sent the photo${this.fileName ? ` "${this.filename}"` : ""} to chat, "${this.chatId}"`);
    return resp;
  },
};
