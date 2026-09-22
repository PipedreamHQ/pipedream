import recruiterflow from "../../recruiterflow.app.mjs";

export default {
  key: "recruiterflow-list-department-id-options",
  name: "List Department ID Options",
  description: "Retrieves available options for the Department ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    recruiterflow,
  },
  async run({ $ }) {
    const options = await recruiterflow.propDefinitions.departmentId.options
      .call(this.recruiterflow);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
