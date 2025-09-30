import app from "../../pingbell.app.mjs";

export default {
  name: "Send Notification",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "pingbell-send-notification",
  description: "Sends a notification to a Pingbell. [See the documentation](https://pingbell.io/docs/pingbell-api/post-notifications/)",
  type: "action",
  props: {
    app,
    pingbellId: {
      propDefinition: [
        app,
        "pingbellId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.sendNotification({
      $,
      params: {
        id: this.pingbellId,
      },
    });

    if (response) {
      $.export("$summary", `Successfully sent notification to Pingbell with ID ${this.pingbellId}`);
    }

    return response;
  },
};
