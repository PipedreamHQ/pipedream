import app from "../../zulip.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "zulip-send-message",
  name: "Send Message",
  description: "Send a direct or channel message. [See the documentation](https://zulip.com/api/send-message)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    type: {
      propDefinition: [
        app,
        "type",
      ],
    },
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
    channelId: {
      propDefinition: [
        app,
        "channelId",
      ],
    },
    topic: {
      propDefinition: [
        app,
        "topic",
        (c) => ({
          channelId: c.channelId,
        }),
      ],
    },
    content: {
      propDefinition: [
        app,
        "content",
      ],
    },
  },

  async run({ $ }) {
    const isDirect = this.type === "direct" || this.type === "private";
    const isChannel = this.type === "channel" || this.type === "stream";

    if (isDirect && (!this.userId || this.userId.length === 0)) {
      throw new ConfigurationError("You must provide at least one User ID when the type is 'direct' or 'private'.");
    }

    if (isChannel && !this.channelId) {
      throw new ConfigurationError("You must provide a Channel ID when the type is 'channel' or 'stream'.");
    }

    if ((isDirect && this.channelId) || (isChannel && this.userId?.length > 0)) {
      throw new ConfigurationError(`Invalid input: '${this.type}' messages require only ${isDirect
        ? "User ID(s)"
        : "a Channel ID"}.`);
    }
    const response = await this.app.sendMessage({
      $,
      params: {
        type: this.type,
        to: this.channelId || `[${this.userId.join(",")}]`,
        topic: this.topic,
        content: this.content,
      },
    });
    $.export("$summary", `Sucessfully sent message with ID ${response.id}`);
    return response;
  },
};
