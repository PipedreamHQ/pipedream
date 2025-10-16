import deepseek from "../../deepseek.app.mjs";

export default {
  key: "deepseek-list-models",
  name: "List Models",
  description: "Lists the currently available models, and provides basic information about each one such as the owner and availability. [See the documentation](https://api-docs.deepseek.com/api/list-models)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    deepseek,
  },
  async run({ $ }) {
    const models = await this.deepseek.listModels({
      $,
    });
    $.export("$summary", "Successfully listed models");
    return models;
  },
};
