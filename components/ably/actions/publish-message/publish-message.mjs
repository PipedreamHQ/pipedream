import ably from "../../ably.app.mjs";

export default {
  name: "Publish Message",
  version: "0.0.1",
  key: "ably-publish-message",
  description: "Publish a message in a channel. [See docs here](https://ably.com/docs/realtime/messages#message-publish)",
  type: "action",
  props: {
    ably,
    channelName: {
      label: "Channel Name",
      description: "The name of channel that will be published",
      type: "string",
    },
    eventName: {
      label: "Event Name",
      description: "The event name that will be published",
      type: "string",
    },
    messageData: {
      label: "Message Data",
      description: "The data of the message that will be published",
      type: "string",
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
