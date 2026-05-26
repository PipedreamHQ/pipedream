import parma from "../../parma.app.mjs";

export default {
  key: "parma-list-group-ids-options",
  name: "List Group Ids Options",
  description: "Retrieves available options for the Group Ids field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    parma,
  },
  async run({ $ }) {
    const options = await parma.propDefinitions.groupIds.options.call(this.parma);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
