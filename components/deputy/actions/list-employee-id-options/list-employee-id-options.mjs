import { deputy } from "../../deputy.app.mjs";

export default {
  key: "deputy-list-employee-id-options",
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
    deputy,
  },
  async run({ $ }) {
    const options = await deputy.propDefinitions.employeeId.options.call(this.deputy, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
