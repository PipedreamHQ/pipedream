import splitwise from "../../splitwise.app.mjs";

export default {
  key: "splitwise-list-friend-options",
  name: "List Friend Options",
  description: "Retrieves available options for the Friend field.",
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
    const options = await splitwise.propDefinitions.friend.options.call(this.splitwise);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
