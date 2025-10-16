import pushcut from "../../pushcut.app.mjs";

export default {
  key: "pushcut-send-notification",
  name: "Send Notification",
  description: "Sends a smart notification to your devices. [See the documentation](https://www.pushcut.io/webapi)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pushcut,
    notification: {
      propDefinition: [
        pushcut,
        "notification",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.pushcut.sendNotification({
      notification: this.notification,
      $,
    });

    if (response.id) {
      $.export("$summary", `Successfully sent notification with ID ${response.id}.`);
    }

    return response;
  },
};
