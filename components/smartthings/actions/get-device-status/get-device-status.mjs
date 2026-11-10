import smartthings from "../../smartthings.app.mjs";

export default {
  key: "smartthings-get-device-status",
  name: "Get Device Status",
  description: "Retrieves the current status (capability attribute values) of a SmartThings device. [See the documentation](https://developer.smartthings.com/docs/api/public#tag/Devices/operation/getDeviceStatus)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    smartthings,
    locationId: {
      propDefinition: [
        smartthings,
        "locationId",
      ],
      description: "Filter the device list by location",
      optional: true,
    },
    deviceId: {
      propDefinition: [
        smartthings,
        "deviceId",
        (c) => ({
          locationId: c.locationId,
        }),
      ],
    },
    component: {
      propDefinition: [
        smartthings,
        "component",
      ],
      description: "Only return the status of this component (e.g. `main`). Leave blank to return the status of every component.",
      default: "",
    },
  },
  async run({ $ }) {
    const response = this.component
      ? await this.smartthings.getDeviceComponentStatus({
        $,
        deviceId: this.deviceId,
        component: this.component,
      })
      : await this.smartthings.getDeviceStatus({
        $,
        deviceId: this.deviceId,
      });
    $.export("$summary", `Successfully retrieved status for device ${this.deviceId}`);
    return response;
  },
};
