import onesignalRestApi from "../../onesignal_rest_api.app.mjs";

export default {
  key: "onesignal_rest_api-get-device",
  name: "Get Device",
  description: "Get a specific device. [See docs here](https://documentation.onesignal.com/reference/view-device)",
  version: "0.0.1652718587",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    onesignalRestApi,
    deviceId: {
      propDefinition: [
        onesignalRestApi,
        "deviceId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.onesignalRestApi.getDevice({
      deviceId: this.deviceId,
      $,
    });

    $.export("$summary", "Successfully retrieved device.");

    return response;
  },
};
