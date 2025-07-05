import prodatakey from "../../prodatakey.app.mjs";

export default {
  key: "prodatakey-open-and-close-device",
  name: "Open and Close Device",
  description: "Opens and closes a device in the ProdataKey system. [See the documentation](https://developer.pdk.io/web/2.0/rest/devices#open-and-close-a-device)",
  version: "0.0.1",
  type: "action",
  props: {
    prodatakey,
    organizationId: {
      propDefinition: [
        prodatakey,
        "organizationId",
      ],
    },
    cloudNodeId: {
      propDefinition: [
        prodatakey,
        "cloudNodeId",
        ({ organizationId }) => ({
          organizationId,
        }),
      ],
    },
    deviceId: {
      propDefinition: [
        prodatakey,
        "deviceId",
        ({
          organizationId, cloudNodeId,
        }) => ({
          organizationId,
          cloudNodeId,
        }),
      ],
    },
    dwell: {
      type: "integer",
      label: "Dwell",
      description: "The amount of time (in tenths of a second) the device will remain open before closing. This value will override the dwell time configured in pdk.io.",
      min: 1,
      max: 5400,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.prodatakey.openAndCloseDevice({
      $,
      organizationId: this.organizationId,
      cloudNodeId: this.cloudNodeId,
      deviceId: this.deviceId,
      data: {
        dwell: this.dwell,
      },
    });

    $.export("$summary", `Successfully sent command to device with ID: ${this.deviceId}`);
    return response;
  },
};
