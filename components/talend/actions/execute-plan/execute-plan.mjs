import app from "../../talend.app.mjs";

export default {
  name: "Execute Plan",
  description: "Allows to run a Plan. [See the documentation](https://api.talend.com/apis/processing/2021-03/#operation_execute-plan).",
  key: "talend-execute-plan",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    planExecutable: {
      propDefinition: [
        app,
        "planExecutable",
      ],
    },
  },
  async run({ $ }) {
    const res = await this.app.executePlan(this.planExecutable);
    $.export("summary", `Successfully executed plan "${this.planExecutable}".`);
    return res;
  },
};
