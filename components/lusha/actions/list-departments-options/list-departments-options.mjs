import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-list-departments-options",
  name: "List Contact Departments Options",
  description: "Retrieves available options for the Contact Departments field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    lusha,
  },
  async run({ $ }) {
    const options = await lusha.propDefinitions.departments.options.call(this.lusha);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
