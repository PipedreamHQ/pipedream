import ably from "../../ably.app.mjs";

export default {
  name: "Publish Push Notification",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "ably-publish-push-notification",
  description: "Publish a push notification for a channel. [See docs here](https://ably.com/docs/general/push/publish#channel-broadcast-example)",
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
      type: "object",
    },
  },
  async run({ $ }) {
    const response = await this.ably.publishMessage({
      $,
      channelName: this.channelName,
      data: {
        name: this.eventName,
        data: this.notificationData,
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
