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
    parcelUuid: {
      propDefinition: [
        app,
        "parcelUuid",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      parcelUuid,
    } = this;

    const response = await app.getTrackingInfo({
      $,
      parcelUuid,
    });

    $.export("$summary", `Successfully retrieved tracking info for parcel \`${parcelUuid}\``);

    return response;
  },
};
