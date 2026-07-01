import renderio from "../../renderio.app.mjs";
import {
  parseObject,
  parseRequiredObject,
} from "../../common/utils.mjs";

export default {
  key: "renderio-execute-preset",
  name: "Execute Preset",
  description: "Execute a RenderIO preset with input files. [See the documentation](https://renderio.dev/docs/api-reference/presets/execute-preset)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    renderio,
    presetId: {
      type: "string",
      label: "Preset ID",
      description: "The unique identifier of the preset to execute, for example `preset_12345`. Use **List Presets** to discover options.",
    },
    inputFiles: {
      propDefinition: [
        renderio,
        "inputFiles",
      ],
    },
    metadata: {
      propDefinition: [
        renderio,
        "metadata",
      ],
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "Optional URL to receive a notification when the execution completes.",
      optional: true,
    },
  },
  async run({ $ }) {
    const inputFiles = parseRequiredObject(this.inputFiles, "Input File URLs");
    const metadata = parseObject(this.metadata, "Metadata");

    const data = {
      input_files: inputFiles,
    };

    if (metadata) data.metadata = metadata;
    if (this.webhookUrl) data.webhook_url = this.webhookUrl;

    const response = await this.renderio.executePreset({
      $,
      presetId: this.presetId,
      data,
    });
    $.export("$summary", `Successfully executed preset ${this.presetId}`);
    return response;
  },
};
