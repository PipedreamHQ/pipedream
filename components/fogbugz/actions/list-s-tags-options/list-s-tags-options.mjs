import fogbugz from "../../fogbugz.app.mjs";

export default {
  key: "fogbugz-list-s-tags-options",
  name: "List sTags Options",
  description: "Retrieves available options for the sTags field.",
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
    const options = await fogbugz.propDefinitions.sTags.options.call(this.fogbugz);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
