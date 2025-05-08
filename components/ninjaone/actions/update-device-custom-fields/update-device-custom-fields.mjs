import app from "../../ninjaone.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "ninjaone-update-device-custom-fields",
  name: "Update Device Custom Fields",
  description: "Update custom fields for a device in NinjaOne. Requires a device identifier. Optionally update the device name, group, or status. [See the documentation](https://app.ninjarmm.com/apidocs/?links.active=core#/devices/updateNodeAttributeValues).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    deviceId: {
      propDefinition: [
        app,
        "deviceId",
      ],
    },
    data: {
      type: "object",
      label: "Custom Fields",
      description: "Additional custom fields to update.",
    },
  },
  methods: {
    updateDeviceCustomFields({
      deviceId, ...args
    } = {}) {
      return this.app.patch({
        path: `/device/${deviceId}/custom-fields`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      updateDeviceCustomFields,
      deviceId,
      data,
    } = this;

    const response = await updateDeviceCustomFields({
      $,
      deviceId,
      data: utils.parse(data),
    });

    $.export("$summary", "Successfully updated device custom fields.");
    return response;
  },
};
