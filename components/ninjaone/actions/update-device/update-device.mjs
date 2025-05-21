import ninjaone from "../../ninjaone.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ninjaone-update-device",
  name: "Update Device",
  description: "Update details for a specific device in NinjaOne. [See the documentation](https://app.ninjarmm.com/apidocs/?links.active=core)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ninjaone,
    deviceId: {
      propDefinition: [
        ninjaone,
        "deviceId",
      ],
    },
    deviceAttributes: {
      propDefinition: [
        ninjaone,
        "deviceAttributes",
      ],
      type: "string",
      label: "Device Attributes",
      description: "JSON string of attributes to update on the device",
    },
  },
  async run({ $ }) {
    const response = await this.ninjaone.updateDevice(this.deviceId, this.deviceAttributes);
    $.export("$summary", `Successfully updated device with ID ${this.deviceId}`);
    return response;
  },
};
