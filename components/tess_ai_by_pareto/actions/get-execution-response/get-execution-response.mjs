import tess_ai_by_pareto from "../../tess_ai_by_pareto.app.mjs";

export default {
  key: "tess_ai_by_pareto-get-execution-response",
  name: "Get AI Execution Response",
  description: "Retrieves the result of a previously executed AI template (image, text, or video). [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    tess_ai_by_pareto,
    executionId: {
      propDefinition: [
        "tess_ai_by_pareto",
        "executionId",
      ],
    },
  },
  async run({ $ }) {
    const result = await this.tess_ai_by_pareto.getAiTemplateResult({
      executionId: this.executionId,
    });
    $.export("$summary", `Retrieved AI Execution Result for Execution ID ${this.executionId}`);
    return result;
  },
};
