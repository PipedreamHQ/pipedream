import domain_group from "../../domain_group.app.mjs";

export default {
  key: "domain_group-list-agency-id-options",
  name: "List Agency ID Options",
  description: "Retrieves available options for the Agency ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    domain_group,
  },
  async run({ $ }) {
    const options = await domain_group.propDefinitions.agencyId.options.call(this.domain_group);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
