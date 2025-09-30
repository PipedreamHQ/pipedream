import app from "../../talend.app.mjs";

export default {
  name: "Get Plan Execution Status",
  description: "Get detailed status of one plan execution. [See the documentation](https://api.talend.com/apis/processing/2021-03/#operation_get-plan-execution-status).",
  key: "talend-get-plan-execution-status",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    planExecutionId: {
      propDefinition: [
        app,
        "planExecutionId",
      ],
    },
  },
  async run({ $ }) {
    const res = await this.app.getPlanExecutionStatus(this.planExecutionId);
    $.export("summary", `Successfully fetched status of plan execution "${this.planExecutionId}".`);
    return res;
  },
};
