import affinda from "../../affinda.app.mjs";

export default {
  key: "affinda-list-organization-options",
  name: "List Organization Options",
  description: "Retrieves available options for the Organization field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    affinda,
  },
  async run({ $ }) {
    const options = await affinda.propDefinitions.organization.options.call(this.affinda);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
