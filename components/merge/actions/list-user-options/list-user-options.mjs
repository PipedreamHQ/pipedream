import merge from "../../merge.app.mjs";

export default {
  key: "merge-list-user-options",
  name: "List ID Options",
  description: "Retrieves available options for the ID field.",
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
