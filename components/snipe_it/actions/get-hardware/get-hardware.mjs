import app from "../../snipe_it.app.mjs";

export default {
  key: "snipe_it-get-hardware",
  name: "Get Hardware Asset",
  description: "Retrieves details of a specific hardware asset by ID. [See the documentation](https://snipe-it.readme.io/reference/hardware-by-id)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    hardwareId: {
      propDefinition: [
        app,
        "hardwareId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getHardware({
      $,
      hardwareId: this.hardwareId,
    });

    $.export("$summary", `Successfully retrieved hardware asset details with ID \`${response.id}\``);
    return response;
  },
};
