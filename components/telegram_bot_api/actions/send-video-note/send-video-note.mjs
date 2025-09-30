import telegramBotApi from "../../telegram_bot_api.app.mjs";
import contentTypes from "../../common/content-types.mjs";

export default {
  key: "telegram_bot_api-send-video-note",
  name: "Send a Video Note",
  description: "As of v.4.0, Telegram clients support rounded square mp4 videos of up to 1 minute long. Use this method to send video messages. [See the docs](https://core.telegram.org/bots/api#sendvideonote) for more information",
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
    filename: {
      propDefinition: [
        telegramBotApi,
        "filename",
      ],
    },
    videoNote: {
      propDefinition: [
        telegramBotApi,
        "media",
      ],
      label: "Video Note",
    },
    contentType: {
      propDefinition: [
        telegramBotApi,
        "contentType",
      ],
      options: contentTypes.video,
    },
    length: {
      propDefinition: [
        telegramBotApi,
        "length",
      ],
    },
    duration: {
      propDefinition: [
        telegramBotApi,
        "duration",
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
    const resp = await this.telegramBotApi.sendVideoNote(this.chatId, this.videoNote, {
      length: this.length,
      duration: this.duration,
      reply_to_message_id: this.reply_to_message_id,
      reply_markup: this.reply_markup,
      filename: this.filename,
      contentType: this.contentType,
    });
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully sent the video note${this.fileName ? ` "${this.filename}"` : ""} to chat, "${this.chatId}"`);
    return resp;
  },
};
