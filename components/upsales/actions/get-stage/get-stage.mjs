import app from "../../upsales.app.mjs";

export default {
  key: "upsales-get-stage",
  name: "Get Stage",
  description: "Retrieves a single order stage by ID from Upsales. [See the documentation](https://api.upsales.com/#3e8b5e8d-3f4a-4e8e-8b5e-8d3f4a4e8e8b)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    stageId: {
      propDefinition: [
        app,
        "stageId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getStage({
      $,
      stageId: this.stageId,
    });

    $.export("$summary", `Successfully retrieved stage: ${response.name || this.stageId}`);
    return response;
  },
};

