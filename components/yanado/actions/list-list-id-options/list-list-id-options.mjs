import yanado from "../../yanado.app.mjs";

export default {
  key: "yanado-list-list-id-options",
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
    yanado,
  },
  async run({ $ }) {
    const options = await yanado.propDefinitions.listId.options.call(this.yanado);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
