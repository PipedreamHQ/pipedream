import flock from "../../flock.app.mjs";

export default {
  key: "flock-send-direct-message",
  name: "Send Direct Message",
  description: "Send a direct message to a user. [See the documentation](https://docs.flock.com/display/flockos/chat.sendMessage)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    flock,
    channelId: {
      propDefinition: [
        flock,
        "channelId",
      ],
      optional: true,
    },
    userId: {
      propDefinition: [
        flock,
        "userId",
        (c) => ({
          channelId: c.channelId,
        }),
      ],
    },
    text: {
      propDefinition: [
        flock,
        "text",
      ],
    },
    flockml: {
      propDefinition: [
        flock,
        "flockml",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.flock.sendMessage({
      $,
      params: {
        to: this.userId,
        text: this.text,
        flockml: this.flockml,
      },
    });
    $.export("$summary", `Successfully sent message with ID ${response.uid}`);
    return response;
  },
};
