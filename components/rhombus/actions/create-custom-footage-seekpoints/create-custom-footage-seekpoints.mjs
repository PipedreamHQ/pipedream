import rhombus from "../../rhombus.app.mjs";

export default {
  key: "rhombus-create-custom-footage-seekpoints",
  name: "Create Custom Footage Seekpoints",
  description: "Create custom activity seekpoints for a specified camera. [See the documentation](https://apidocs.rhombus.com/reference/createcustomfootageseekpoints)",
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
    name: {
      type: "string",
      label: "Name",
      description: "The name of the custom seekpoint",
    },
    timestampMs: {
      type: "integer",
      label: "Timestamp (ms)",
      description: "The timestamp of the custom seekpoint (in milliseconds since the Unix epoch)",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description for the custom seekpoint",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.rhombus.createCustomFootageSeekpoints({
      $,
      data: {
        cameraUuid: this.cameraUuid,
        footageSeekpoints: [
          {
            name: this.name,
            timestampMs: this.timestampMs,
            description: this.description,
          },
        ],
      },
    });

    $.export("$summary", `Created custom footage seekpoint for camera ${this.cameraUuid}`);
    return response;
  },
};
