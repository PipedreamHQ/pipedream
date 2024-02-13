import morningmate from "../../morningmate.app.mjs";

export default {
  key: "morningmate-create-notification",
  name: "Create Notification",
  description: "Sends a notification message to the user.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    morningmate,
    message: {
      type: "string",
      label: "Message",
      description: "The text of the notification message",
    },
  },
  async run({ $ }) {
    const response = await this.morningmate.sendNotification({
      message: this.message,
    });
    $.export("$summary", `Successfully sent notification: ${this.message}`);
    return response;
  },
};
