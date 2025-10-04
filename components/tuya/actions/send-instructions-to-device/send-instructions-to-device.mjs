import tuya from "../../tuya.app.mjs";

export default {
  key: "tuya-send-instructions-to-device",
  name: "Send Instructions to Device",
  description: "Send an instruction to the specified device. [See the documentation](https://developer.tuya.com/en/docs/cloud/device-control?id=K95zu01ksols7#title-35-Send%20instructions%20to%20the%20device)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    tuya,
    userId: {
      propDefinition: [
        tuya,
        "userId",
      ],
    },
    homeId: {
      propDefinition: [
        tuya,
        "homeId",
        (c) => ({
          userId: c.userId,
        }),
      ],
      optional: true,
    },
    deviceId: {
      propDefinition: [
        tuya,
        "deviceId",
        (c) => ({
          userId: c.userId,
          homeId: c.homeId,
        }),
      ],
    },
    instructionCode: {
      propDefinition: [
        tuya,
        "instructionCode",
        (c) => ({
          deviceId: c.deviceId,
        }),
      ],
    },
    value: {
      type: "string",
      label: "Value",
      description: "The value to set",
    },
  },
  async run({ $ }) {
    const response = await this.tuya.sendInstructionsToDevice({
      deviceId: this.deviceId,
      data: {
        commands: [
          {
            code: this.instructionCode,
            value: this.value,
          },
        ],
      },
    });
    if (response.success) {
      $.export("$summary", "Successfully sent instructions to device");
    }
    return response;
  },
};
