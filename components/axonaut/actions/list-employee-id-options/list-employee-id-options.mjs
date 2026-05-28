import axonaut from "../../axonaut.app.mjs";

export default {
  key: "axonaut-list-employee-id-options",
  name: "List Employee ID Options",
  description: "Retrieves available options for the Employee ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    axonaut,
  },
  async run({ $ }) {
    const options = await axonaut.propDefinitions.employeeId.options.call(this.axonaut, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
