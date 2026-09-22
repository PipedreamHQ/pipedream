import app from "../../upsales.app.mjs";

export default {
  key: "upsales-create-stage",
  name: "Create Stage",
  description: "Creates a new order stage in Upsales. [See the documentation](https://api.upsales.com/#3e8b5e8d-3f4a-4e8e-8b5e-8d3f4a4e8e8b)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "stageName",
      ],
    },
    probability: {
      propDefinition: [
        app,
        "stageProbability",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createStage({
      $,
      data: {
        name: this.name,
        probability: this.probability,
      },
    });

    $.export("$summary", `Successfully created stage: ${this.name}`);
    return response;
  },
};

