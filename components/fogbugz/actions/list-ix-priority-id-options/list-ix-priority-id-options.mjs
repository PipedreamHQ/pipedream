import fogbugz from "../../fogbugz.app.mjs";

export default {
  key: "fogbugz-list-ix-priority-id-options",
  name: "List Ix Priority Id Options",
  description: "Retrieves available options for the Ix Priority Id field.",
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
    const options = await fogbugz.propDefinitions.ixPriorityId.options.call(this.fogbugz);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
