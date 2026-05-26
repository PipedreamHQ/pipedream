import stannp from "../../stannp.app.mjs";

export default {
  key: "stannp-list-group-id-options",
  name: "List Group ID Options",
  description: "Retrieves available options for the Group ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    stannp,
  },
  async run({ $ }) {
    const options = await stannp.propDefinitions.groupId.options.call(this.stannp);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
