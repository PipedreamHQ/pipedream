import recruiterflow from "../../recruiterflow.app.mjs";

export default {
  key: "recruiterflow-list-employment-type-id-options",
  name: "List Employment Type ID Options",
  description: "Retrieves available options for the Employment Type ID field.",
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
    const options = await recruiterflow.propDefinitions.employmentTypeId.options
      .call(this.recruiterflow);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
