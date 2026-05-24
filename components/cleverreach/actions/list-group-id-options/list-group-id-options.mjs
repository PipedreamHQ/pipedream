import cleverreach from "../../cleverreach.app.mjs";

export default {
  key: "cleverreach-list-group-id-options",
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
    cleverreach,
  },
  async run({ $ }) {
    const options = await cleverreach.propDefinitions.groupId.options.call(this.cleverreach);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
