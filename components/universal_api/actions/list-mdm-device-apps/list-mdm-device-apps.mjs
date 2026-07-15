import app from "../../universal_api.app.mjs";

export default {
  key: "universal_api-list-mdm-device-apps",
  name: "List MDM Device Apps",
  description:
    "List device apps from the MDM API on Universal API. Returns an array of device-app objects. [See the documentation](https://docs.universalapi.io/reference/list-device-apps).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    consumerId: {
      propDefinition: [
        app,
        "consumerId",
      ],
    },
    deviceId: {
      type: "string",
      label: "Device ID",
      description: "The ID of the device to list apps for. Use the **List MDM Devices** action to get a device ID.",
    },
    mdmServiceId: {
      propDefinition: [
        app,
        "mdmServiceId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.listMdmDeviceApps({
      $,
      consumerId: this.consumerId,
      deviceId: this.deviceId,
      serviceId: this.mdmServiceId,
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} MDM device app(s)`);
    return response;
  },
};
