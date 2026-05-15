import hackerone from "../../hackerone.app.mjs";

export default {
  key: "hackerone-list-organization-id-options",
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
    hackerone,
  },
  async run({ $ }) {
    const options = await hackerone.propDefinitions.organizationId.options.call(this.hackerone);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
