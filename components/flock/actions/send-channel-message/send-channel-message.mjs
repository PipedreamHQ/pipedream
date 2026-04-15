import flock from "../../flock.app.mjs";

export default {
  key: "flock-send-channel-message",
  name: "Send Channel Message",
  description: "Send a message to a channel. [See the documentation](https://docs.flock.com/display/flockos/chat.sendMessage)",
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
        to: this.channelId,
        text: this.text,
        flockml: this.flockml,
      },
    });
    $.export("$summary", `Successfully sent message with ID ${response.uid}`);
    return response;
  },
};
