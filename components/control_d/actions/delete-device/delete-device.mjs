import app from "../../control_d.app.mjs";

export default {
  key: "control_d-delete-device",
  name: "Delete Device",
  description: "Delete a device with the specified ID. [See the documentation](https://docs.controld.com/reference/delete_devices-device-id)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    deviceId: {
      propDefinition: [
        app,
        "deviceId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteDevice({
      $,
      device_id: this.deviceId,
    });

    $.export("$summary", `Successfully deleted the device with the ID ${this.deviceId}`);

    return response;
  },
};
