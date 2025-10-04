import onesignalRestApi from "../../onesignal_rest_api.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "onesignal_rest_api-add-device",
  name: "Add Device",
  description: "Register a new device to your app. [See docs here](https://documentation.onesignal.com/reference/add-a-device)",
  version: "0.0.1652718587",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    onesignalRestApi,
    deviceType: {
      label: "Device Type",
      description: "The device's platform. E.g. 0 = iOS, 1 = Android...",
      type: "string",
      options: constants.DEVICE_TYPES,
    },
    identifier: {
      label: "Identifier",
      description: "For Push Notifications, this is the Push Token Identifier from Google or Apple.",
      type: "string",
      optional: true,
    },
    timezone: {
      label: "Timezone",
      description: "Number of seconds away from UTC. E.g. -28800",
      type: "integer",
      optional: true,
    },
  },
  async run({ $ }) {
    console.log({
      device_type: this.deviceType,
      identifier: this.identifier,
      timezone: this.timezone,
    });
    const response = await this.onesignalRestApi.addDevice({
      data: {
        device_type: +this.deviceType,
        identifier: this.identifier,
        timezone: this.timezone,
      },
      $,
    });

    $.export("$summary", "Successfully added device.");

    return response;
  },
};
