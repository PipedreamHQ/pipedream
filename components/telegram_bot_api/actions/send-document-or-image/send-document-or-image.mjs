import telegramBotApi from "../../telegram_bot_api.app.mjs";
import contentTypes from "../../common/content-types.mjs";

export default {
  key: "telegram_bot_api-send-document-or-image",
  name: "Send a Document/Image",
  description: "Sends a document or an image to your Telegram Desktop application. [See the docs](https://core.telegram.org/bots/api#senddocument) for more information",
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
      description: "Enter the file caption.",
    },
    filename: {
      propDefinition: [
        telegramBotApi,
        "filename",
      ],
    },
    doc: {
      propDefinition: [
        telegramBotApi,
        "media",
      ],
      label: "Document or Image",
    },
    parse_mode: {
      propDefinition: [
        telegramBotApi,
        "parse_mode",
      ],
    },
    contentType: {
      propDefinition: [
        telegramBotApi,
        "contentType",
      ],
      options: contentTypes.all,
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
    const resp = await this.telegramBotApi.sendDocument(this.chatId, this.doc, {
      caption: this.caption,
      parse_mode: this.parse_mode,
      disable_notification: this.disable_notification,
      reply_to_message_id: this.reply_to_message_id,
      reply_markup: this.reply_markup,
      filename: this.filename,
      contentType: this.contentType,
    });
    $.export("$summary", `Successfully sent the document "${resp.document?.file_name}" to chat, "${this.chatId}"`);
    return resp;
  },
};
