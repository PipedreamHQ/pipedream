import renderio from "../../renderio.app.mjs";

export default {
  key: "renderio-get-preset",
  name: "Get Preset",
  description: "Retrieve a preset by ID. [See the documentation](https://renderio.dev/docs/api-reference/presets/get-preset)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    renderio,
    presetId: {
      type: "string",
      label: "Preset ID",
      description: "The unique identifier of the preset to retrieve, for example `preset_12345`. Use **List Presets** to discover options.",
    },
  },
  async run({ $ }) {
    const response = await this.renderio.getPreset({
      $,
      presetId: this.presetId,
    });
    $.export("$summary", `Successfully retrieved preset ${this.presetId}`);
    return response;
  },
};
