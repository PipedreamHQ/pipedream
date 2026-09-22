import posthog from "../../posthog.app.mjs";

export default {
  key: "posthog-list-organization-id-options",
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
    posthog,
  },
  async run({ $ }) {
    const options = await posthog.propDefinitions.organizationId.options.call(this.posthog);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
