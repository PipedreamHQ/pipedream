import diabatix_coldstream from "../../diabatix_coldstream.app.mjs";

export default {
  key: "diabatix_coldstream-list-organization-id-options",
  name: "List Organization ID Options",
  description: "Retrieves available options for the Organization ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    diabatix_coldstream,
  },
  async run({ $ }) {
    const options = await diabatix_coldstream.propDefinitions.organizationId.options
      .call(this.diabatix_coldstream);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
