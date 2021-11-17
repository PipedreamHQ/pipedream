/* eslint-disable camelcase */
const telegram_bot_api = require("../../telegram_bot_api.app.js");

module.exports = {
  key: "telegram_bot_api-send-album",
  name: "Send an Album (Media Group)",
  description: "Sends a group of photos or videos as an album",
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
    media: {
      type: "any",
      label: "Media",
      description: "A JSON-serialized array describing photos and videos to be sent, must include 2–10 items (e.g., `[{\"type\":\"photo\",\"media\":\"https://example.com/myImage.jpeg\"},{\"type\":\"video\",\"media\":\"/tmp/myVideo.mp4\"}]`)",
      optional: false,
    },
    disable_notification: {
      propDefinition: [
        telegram_bot_api,
        "disable_notification",
      ],
    },
  },
  async run() {
    let media = this.media;
    if (typeof media === "string") {
      try {
        media = JSON.parse(media);
      } catch (err) {
        throw new Error("media must be deserializable to JSON");
      }
    }
    return await this.telegram_bot_api.sendMediaGroup(this.chatId, media, {
      disable_notification: this.disable_notification,
    });
  },
};
