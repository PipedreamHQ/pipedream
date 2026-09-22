import hullo from "../../hullo.app.mjs";

export default {
  key: "hullo-list-attributes-options",
  name: "List Attributes Options",
  description: "Retrieves available options for the Attributes field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    hullo,
  },
  async run({ $ }) {
    const options = await hullo.propDefinitions.attributes.options.call(this.hullo);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
