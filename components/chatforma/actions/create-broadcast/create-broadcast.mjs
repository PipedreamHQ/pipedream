import chatforma from "../../chatforma.app.mjs";

export default {
  key: "chatforma-create-broadcast",
  name: "Create Broadcast",
  description: "Sends a broadcast message to a segment of users. [See the documentation](https://docs.chatforma.com/#/developers/post_bots__botId__segments__segmentId__dispatch)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    chatforma,
    botId: {
      propDefinition: [
        chatforma,
        "botId",
      ],
    },
    segmentId: {
      propDefinition: [
        chatforma,
        "segmentId",
        ({ botId }) => ({
          botId,
        }),
      ],
    },
    content: {
      propDefinition: [
        chatforma,
        "content",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.chatforma.dispatchSegmentBroadcast({
      $,
      botId: this.botId,
      segmentId: this.segmentId,
      data: {
        content: this.content,
      },
    });

    $.export("$summary", `Successfully sent broadcast to segment ${this.segmentId}`);
    return response;
  },
};
