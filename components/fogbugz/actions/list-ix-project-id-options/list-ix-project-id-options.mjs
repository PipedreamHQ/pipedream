import fogbugz from "../../fogbugz.app.mjs";

export default {
  key: "fogbugz-list-ix-project-id-options",
  name: "List Ix Project Id Options",
  description: "Retrieves available options for the Ix Project Id field.",
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
    const options = await fogbugz.propDefinitions.ixProjectId.options.call(this.fogbugz);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
