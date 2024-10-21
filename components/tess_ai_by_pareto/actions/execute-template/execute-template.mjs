import tess_ai_by_pareto from "../../tess_ai_by_pareto.app.mjs";

export default {
  key: "tess_ai_by_pareto-execute-template",
  name: "Execute AI Template",
  description: "Executes an AI template and returns the execution ID. [See the documentation]()",
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
    inputs: {
      propDefinition: [
        "tess_ai_by_pareto",
        "inputs",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.tess_ai_by_pareto.executeAiTemplate({
      templateId: this.templateId,
      inputs: this.inputs,
    });
    $.export("$summary", `Executed AI template with Execution ID ${response.id}`);
    return {
      executionId: response.id,
    };
  },
};
