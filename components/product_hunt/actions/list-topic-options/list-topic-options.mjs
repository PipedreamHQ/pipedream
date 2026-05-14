import product_hunt from "../../product_hunt.app.mjs";

export default {
  key: "product_hunt-list-topic-options",
  name: "List Topic Options",
  description: "Retrieves available options for the Topic field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    product_hunt,
  },
  async run({ $ }) {
    const options = await product_hunt.propDefinitions.topic.options.call(this.product_hunt);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
