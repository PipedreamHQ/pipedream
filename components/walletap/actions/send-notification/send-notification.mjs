import walletap from "../../walletap.app.mjs";

export default {
  key: "walletap-send-notification",
  name: "Send Notification",
  description: "Sends a notification to all pass users. [See the documentation](https://walletap.io/docs/api#tag/Template/operation/sendNotification)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    walletap,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the notification",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the notification",
    },
  },
  async run({ $ }) {
    const response = await this.walletap.sendNotification({
      $,
      data: {
        title: this.title,
        content: this.content,
      },
    });

    $.export("$summary", "Successfully sent notification");
    return response;
  },
};
