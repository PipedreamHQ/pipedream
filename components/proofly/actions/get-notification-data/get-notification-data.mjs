import app from "../../proofly.app.mjs";

export default {
  key: "proofly-get-notification-data",
  name: "Get Notification Data",
  description: "Get data for a notification. [See the documentation here](https://proofly.io/developers)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    campaignId: {
      propDefinition: [
        app,
        "campaignId",
      ],
    },
    notificationId: {
      propDefinition: [
        app,
        "notificationId",
        ({ campaignId }) => ({
          campaignId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      notificationId,
    } = this;

    const response = await app.listData({
      $,
      notificationId,
    });

    $.export("$summary", `Successfully retrieved notification with status \`${response.status}\``);
    return response;
  },
};
