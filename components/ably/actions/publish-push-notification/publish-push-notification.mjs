import ably from "../../ably.app.mjs";

export default {
  name: "Publish Push Notification",
  version: "0.0.1",
  key: "ably-publish-push-notification",
  description: "Publish a push notification for a channel. [See docs here](https://ably.com/docs/general/push/publish#channel-broadcast-example)",
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
    notificationTitle: {
      label: "Notification Title",
      description: "The title of push notification",
      type: "string",
    },
    notificationBody: {
      label: "Notification Body",
      description: "The body of push notification",
      type: "string",
    },
    notificationData: {
      label: "Notification Data",
      description: "The data of push notification",
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
        extras: {
          push: {
            data: this.notificationData,
            notification: {
              title: this.notificationTitle,
              body: this.notificationBody,
            },
          },
        },
      },
    });

    if (response.messageId) {
      $.export("$summary", `Successfully pushed notification with ID ${response.messageId}`);
    }

    return response;
  },
};
