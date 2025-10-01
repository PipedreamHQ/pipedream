import app from "../../ollama.app.mjs";

export default {
  key: "ollama-list-local-models",
  name: "List Local Models",
  description: "List models that are available locally. [See the documentation](https://github.com/ollama/ollama/blob/main/docs/api.md#list-running-models).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.listLocalModels({
      $,
    });
    $.export("$summary", "Successfully listed local models.");
    return response;
  },
};
