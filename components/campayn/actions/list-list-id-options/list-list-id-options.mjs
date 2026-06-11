import campayn from "../../campayn.app.mjs";

export default {
  key: "campayn-list-list-id-options",
  name: "List List Options",
  description: "Retrieves available options for the List field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    campayn,
  },
  async run({ $ }) {
    const options = await campayn.propDefinitions.listId.options.call(this.campayn);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
