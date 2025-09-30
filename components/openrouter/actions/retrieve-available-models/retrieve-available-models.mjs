import openrouter from "../../openrouter.app.mjs";

export default {
  key: "openrouter-retrieve-available-models",
  name: "Retrieve Available Models",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Returns a list of models available through the API. [See the documentation](https://openrouter.ai/docs/api-reference/list-available-models)",
  type: "action",
  props: {
    openrouter,
  },
  async run({ $ }) {
    const response = await this.openrouter.listModels({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response.data.length} available model(s)!`);
    return response;
  },
};
