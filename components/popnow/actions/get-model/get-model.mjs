import app from "../../popnow.app.mjs";

export default {
  key: "popnow-get-model",
  name: "Get Model",
  description: "Get one model, including the input JSON Schema that **Create Job** validates against and its USD rate snapshot. [See the documentation](https://popnow.ai/docs/models)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    modality: {
      propDefinition: [
        app,
        "modality",
      ],
    },
    model: {
      propDefinition: [
        app,
        "model",
        ({ modality }) => ({
          modality,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getModel({
      $,
      model: this.model,
    });
    $.export("$summary", `Successfully retrieved model \`${response?.model ?? this.model}\``);
    return response;
  },
};
