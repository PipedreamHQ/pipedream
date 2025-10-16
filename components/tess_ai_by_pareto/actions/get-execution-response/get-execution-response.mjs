import app from "../../tess_ai_by_pareto.app.mjs";

export default {
  key: "tess_ai_by_pareto-get-execution-response",
  name: "Get Agent Execution Response",
  description:
    "Retrieves the result of a previously executed AI Agent (template). [See the documentation](https://tess.pareto.io/api/swagger#/default/370b6709c5d9e8c17a76e1abb288e7ad)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    executionId: {
      type: "string",
      label: "Agent Execution ID",
      description:
        "The ID of the AI Agent (template) execution to retrieve the result for.",
    },
  },
  async run({ $ }) {
    const result = await this.app.getTemplateResponse({
      $,
      executionId: this.executionId,
    });
    $.export(
      "$summary",
      `Retrieved response for execution ID ${this.executionId}`,
    );
    return result;
  },
};
