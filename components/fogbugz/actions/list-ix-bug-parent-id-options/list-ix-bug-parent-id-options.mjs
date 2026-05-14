import fogbugz from "../../fogbugz.app.mjs";

export default {
  key: "fogbugz-list-ix-bug-parent-id-options",
  name: "List Ix Bug Parent Id Options",
  description: "Retrieves available options for the Ix Bug Parent Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fogbugz,
  },
  async run({ $ }) {
    const options = await fogbugz.propDefinitions.ixBugParentId.options.call(this.fogbugz);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
