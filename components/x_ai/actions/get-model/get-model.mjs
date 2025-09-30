import app from "../../x_ai.app.mjs";

export default {
  key: "x_ai-get-model",
  name: "Get Model",
  description: "List all language and embedding models available. [See the documentation](https://docs.x.ai/api/endpoints#get-model)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    model: {
      propDefinition: [
        app,
        "model",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.getModel({
      $,
      model: this.model,
    });
    $.export("$summary", `Successfully retrieved the '${this.model}' model`);
    return response;
  },
};
