import telegramBotApi from "../../telegram_bot_api.app.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  key: "telegram_bot_api-send-album",
  name: "Send an Album (Media Group)",
  description: "Sends a group of photos or videos as an album. [See the docs](https://core.telegram.org/bots/api#sendmediagroup) for more information",
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
    media: {
      type: "any",
      label: "Media",
      description: toSingleLineString(`
        A JSON-serialized array describing photos and videos to be sent, must include 2–10 items
        (e.g.,
        \`[{"type":"photo","media":"https://example.com/myImage.jpeg"},{"type":"video","media":"/tmp/myVideo.mp4"}]\`).
        [See the docs](https://core.telegram.org/bots/api#inputmedia) for more information about the
        input media object.
      `),
      optional: false,
    },
    disable_notification: {
      propDefinition: [
        telegramBotApi,
        "disable_notification",
      ],
    },
  },
  async run({ $ }) {
    let media = this.media;
    if (typeof media === "string") {
      try {
        media = JSON.parse(media);
      } catch (err) {
        throw new Error("media must be deserializable to JSON");
      }
    }
    const resp = await this.telegramBotApi.sendMediaGroup(this.chatId, media, {
      disable_notification: this.disable_notification,
    });
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully sent an album of ${resp.length} media file${resp.length === 1 ? "" : "s"} to chat, "${this.chatId}"`);
    return resp;
  },
};
