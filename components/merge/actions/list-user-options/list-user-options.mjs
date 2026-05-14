import merge from "../../merge.app.mjs";

export default {
  key: "merge-list-user-options",
  name: "List User Options",
  description: "Retrieves available user options for the user field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    merge,
  },
  async run({ $ }) {
    const options = await merge.propDefinitions.user.options.call(this.merge);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
