import { kenjo } from "../../kenjo.app.mjs";

export default {
  key: "kenjo-list-employee-id-options",
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
    kenjo,
  },
  async run({ $ }) {
    const options = await kenjo.propDefinitions.employeeId.options.call(this.kenjo, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
