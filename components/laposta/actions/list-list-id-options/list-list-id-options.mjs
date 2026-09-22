import laposta from "../../laposta.app.mjs";

export default {
  key: "laposta-list-list-id-options",
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
    laposta,
  },
  async run({ $ }) {
    const options = await laposta.propDefinitions.listId.options.call(this.laposta);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
