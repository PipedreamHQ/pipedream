import newsman from "../../newsman.app.mjs";

export default {
  key: "newsman-list-list-id-options",
  name: "List List ID Options",
  description: "Retrieves available options for the List ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    newsman,
  },
  async run({ $ }) {
    const options = await newsman.propDefinitions.listId.options.call(this.newsman);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
