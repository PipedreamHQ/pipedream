import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-get-send-status",
  name: "Get Send Status",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Track all sent gifts and retrieve analytics information regarding sent gift. [See the docs here](https://sendoso.docs.apiary.io/#reference/send-management/send-tracking/fetch-the-status-of-a-send)",
  type: "action",
  props: {
    sendoso,
    trackingId: {
      propDefinition: [
        sendoso,
        "trackingId",
      ],
    },
  },
  async run({ $ }) {
    const { trackingId } = this;
    const response = await this.sendoso.getSendStatus({
      $,
      trackingId,
    });
    $.export("$summary", "Statuses successfully fetched!");
    return response;
  },
};
