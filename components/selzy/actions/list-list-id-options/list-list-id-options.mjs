import selzy from "../../selzy.app.mjs";

export default {
  key: "selzy-list-list-id-options",
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
    selzy,
  },
  async run({ $ }) {
    const options = await selzy.propDefinitions.listId.options.call(this.selzy);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
