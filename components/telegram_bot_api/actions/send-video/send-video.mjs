import telegramBotApi from "../../telegram_bot_api.app.mjs";
import contentTypes from "../../common/content-types.mjs";

export default {
  key: "telegram_bot_api-send-video",
  name: "Send a Video",
  description: "Sends a video file to your Telegram Desktop application. [See the docs](https://core.telegram.org/bots/api#sendvideo) for more information",
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
      description: "Enter the video caption.",
    },
    filename: {
      propDefinition: [
        telegramBotApi,
        "filename",
      ],
    },
    video: {
      propDefinition: [
        telegramBotApi,
        "media",
      ],
      label: "Video",
    },
    contentType: {
      propDefinition: [
        telegramBotApi,
        "contentType",
      ],
      options: contentTypes.video,
    },
    duration: {
      propDefinition: [
        telegramBotApi,
        "duration",
      ],
    },
    width: {
      propDefinition: [
        telegramBotApi,
        "width",
      ],
    },
    height: {
      propDefinition: [
        telegramBotApi,
        "height",
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
    const resp = await this.telegramBotApi.sendVideo(this.chatId, this.video, {
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
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully sent the video${this.fileName ? ` "${this.filename}"` : ""} to chat, "${this.chatId}"`);
    return resp;
  },
};
