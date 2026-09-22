import turso from "../../turso.app.mjs";

export default {
  key: "turso-list-organization-name-options",
  name: "List Organization Name Options",
  description: "Retrieves available options for the Organization Name field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    turso,
  },
  async run({ $ }) {
    const options = await turso.propDefinitions.organizationName.options.call(this.turso);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
