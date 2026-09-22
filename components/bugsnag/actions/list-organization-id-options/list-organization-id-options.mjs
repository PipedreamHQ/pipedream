import bugsnag from "../../bugsnag.app.mjs";

export default {
  key: "bugsnag-list-organization-id-options",
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
    bugsnag,
  },
  async run({ $ }) {
    const options = await bugsnag.propDefinitions.organizationId.options.call(this.bugsnag);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
