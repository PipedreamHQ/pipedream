import fogbugz from "../../fogbugz.app.mjs";

export default {
  key: "fogbugz-list-filter-id-options",
  name: "List Filter ID Options",
  description: "Retrieves available options for the Filter ID field.",
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
    const options = await fogbugz.propDefinitions.filterId.options.call(this.fogbugz);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
