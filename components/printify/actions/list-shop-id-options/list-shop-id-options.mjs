import printify from "../../printify.app.mjs";

export default {
  key: "printify-list-shop-id-options",
  name: "List Shop ID Options",
  description: "Retrieves available options for the Shop ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    printify,
  },
  async run({ $ }) {
    const options = await printify.propDefinitions.shopId.options.call(this.printify);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
