import app from "../../sendcloud.app.mjs";

export default {
  key: "sendcloud-get-tracking-info",
  name: "Get Tracking Info",
  description: "Retrieve tracking information of a parcel. [See the documentation](https://sendcloud.dev/api/v2/tracking/retrieve-tracking-information-of-a-parcel)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    trackingNumber: {
      propDefinition: [
        app,
        "trackingNumber",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      trackingNumber,
    } = this;

    const response = await app.getTrackingInfo({
      $,
      trackingNumber,
    });

    $.export("$summary", `Successfully retrieved tracking info for parcel \`${trackingNumber}\``);

    return response;
  },
};
