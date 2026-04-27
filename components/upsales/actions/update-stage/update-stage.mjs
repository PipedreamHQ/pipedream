import app from "../../upsales.app.mjs";

export default {
  key: "upsales-update-stage",
  name: "Update Stage",
  description: "Updates an existing order stage in Upsales. [See the documentation](https://api.upsales.com/#3e8b5e8d-3f4a-4e8e-8b5e-8d3f4a4e8e8b)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    stageId: {
      propDefinition: [
        app,
        "stageId",
      ],
    },
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
    const response = await this.app.updateStage({
      $,
      stageId: this.stageId,
      data: {
        name: this.name,
        probability: this.probability,
      },
    });

    $.export("$summary", `Successfully updated stage: ${this.name}`);
    return response;
  },
};

