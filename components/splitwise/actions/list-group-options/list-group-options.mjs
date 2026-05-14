import splitwise from "../../splitwise.app.mjs";

export default {
  key: "splitwise-list-group-options",
  name: "List Group Options",
  description: "Retrieves available options for the Group field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    splitwise,
  },
  async run({ $ }) {
    const options = await splitwise.propDefinitions.group.options.call(this.splitwise);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
