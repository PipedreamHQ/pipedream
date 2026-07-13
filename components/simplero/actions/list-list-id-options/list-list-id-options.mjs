import simplero from "../../simplero.app.mjs";

export default {
  key: "simplero-list-list-id-options",
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
    simplero,
  },
  async run({ $ }) {
    const options = await simplero.propDefinitions.listId.options.call(this.simplero, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
