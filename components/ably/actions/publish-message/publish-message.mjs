import ably from "../../ably.app.mjs";

export default {
  name: "Publish Message",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "ably-publish-message",
  description: "Publish a message in a channel. [See docs here](https://ably.com/docs/realtime/messages#message-publish)",
  type: "action",
  props: {
    ably,
    channelName: {
      propDefinition: [
        ably,
        "channelName",
      ],
      description: "The name of channel that will be published",
    },
    eventName: {
      propDefinition: [
        ably,
        "eventName",
      ],
      description: "The event name that will be published",
    },
    messageData: {
      propDefinition: [
        ably,
        "messageData",
      ],
      description: "The data of the message that will be published",
    },
  },
  async run({ $ }) {
    const response = await this.ably.publishMessage({
      $,
      channelName: this.channelName,
      data: {
        name: this.eventName,
        data: this.messageData,
      },
    });

    if (response.messageId) {
      $.export("$summary", `Successfully published message with ID ${response.messageId}`);
    }

    return response;
  },
};
