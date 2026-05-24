import saleslens from "../../saleslens.app.mjs";

export default {
  key: "saleslens-list-employee-external-id-options",
  name: "List Employee External ID Options",
  description: "Retrieves available options for the Employee External ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    saleslens,
  },
  async run({ $ }) {
    const options = await saleslens.propDefinitions.employeeExternalId.options.call(this.saleslens);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
