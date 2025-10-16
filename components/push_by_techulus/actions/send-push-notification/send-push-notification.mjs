import pushByTechulus from "../../push_by_techulus.app.mjs";

export default {
  key: "push_by_techulus-send-push-notification",
  name: "Send Push Notification",
  description: "Sends a new Push notification to the user. [See the documentation](https://docs.push.techulus.com/api-documentation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pushByTechulus,
    title: {
      type: "string",
      label: "Title",
      description: "Notification title",
    },
    body: {
      type: "string",
      label: "Body",
      description: "Notification body",
    },
    link: {
      type: "string",
      label: "Link",
      description: "Notification link",
      optional: true,
    },
    image: {
      type: "string",
      label: "Image",
      description: "Notification image",
      optional: true,
    },
    timeSensitive: {
      type: "boolean",
      label: "Time Sensitive",
      description: "Set to `true` if the notification is time-sensitive. For iOS only.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pushByTechulus.sendNotification({
      data: {
        title: this.title,
        body: this.body,
        link: this.link,
        image: this.image,
        timeSensitive: this.timeSensitive,
      },
      $,
    });

    if (response?.success) {
      $.export("$summary", "Successfully sent push notification.");
    }

    return response;
  },
};
