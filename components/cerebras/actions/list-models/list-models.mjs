import cerebras from "../../cerebras.app.mjs";

export default {
  name: "List Models",
  key: "cerebras-list-models",
  description: "List all available Cerebras models. [See the documentation](https://inference-docs.cerebras.ai/api-reference/models)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    cerebras,
  },
  async run({ $ }) {
    const response = await this.cerebras.listModels({
      $,
    });

    const models = response.data;
    $.export("$summary", `Successfully retrieved ${models.length} models`);
    return models;
  },
};
