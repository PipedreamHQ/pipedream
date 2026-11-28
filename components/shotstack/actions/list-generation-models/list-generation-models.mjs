import app from "../../shotstack.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "shotstack-list-generation-models",
  name: "List Generation Models",
  description: "List the AI models this account can generate with, each with its `model` ID, `type` (`image`, `video` or `audio`), `name` and the JSON Schema of the `options` it accepts. Call it before **Generate Asset** or **Quote Generation** so the model and its options exist. [See the documentation](https://shotstack.io/docs/api/#list-generation-models)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    assetType: {
      propDefinition: [
        app,
        "assetType",
      ],
      description: "Only list models for this kind of asset: `image`, `video` or `audio`, e.g. `video`. Leave empty for all.",
      optional: true,
    },
  },
  async run({ $ }) {
    const { models } = await this.app.listModels({
      $,
      params: {
        expand: "options",
      },
    });
    const usable = utils.usableModels(models, this.assetType);
    $.export("$summary", `Found ${usable.length} models`);
    return usable;
  },
};
