import rhombus from "../../rhombus.app.mjs";

export default {
  key: "rhombus-reboot-camera",
  name: "Reboot Camera",
  description: "Reboot a camera. [See the documentation](https://apidocs.rhombus.com/reference/rebootcamera)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    rhombus,
    cameraUuid: {
      propDefinition: [
        rhombus,
        "cameraUuid",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rhombus.rebootCamera({
      $,
      data: {
        cameraUuid: this.cameraUuid,
      },
    });
    $.export("$summary", `Rebooted camera ${this.cameraUuid}`);
    return response;
  },
};
