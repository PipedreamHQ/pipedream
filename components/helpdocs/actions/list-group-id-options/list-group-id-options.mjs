import helpdocs from "../../helpdocs.app.mjs";

export default {
  key: "helpdocs-list-group-id-options",
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
    helpdocs,
  },
  async run({ $ }) {
    const options = await helpdocs.propDefinitions.groupId.options.call(this.helpdocs);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
