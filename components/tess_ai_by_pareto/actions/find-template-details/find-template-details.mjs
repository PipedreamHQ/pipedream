import tess_ai_by_pareto from "../../tess_ai_by_pareto.app.mjs";

export default {
  key: "tess_ai_by_pareto-find-template-details",
  name: "Find AI Template Details",
  description: "Retrieves detailed information about a specific AI template. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    tess_ai_by_pareto,
    templateId: {
      propDefinition: [
        "tess_ai_by_pareto",
        "templateId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.tess_ai_by_pareto.getAiTemplateDetails({
      templateId: this.templateId,
    });
    $.export("$summary", `Retrieved details for AI template ${this.templateId}`);
    return response;
  },
};
