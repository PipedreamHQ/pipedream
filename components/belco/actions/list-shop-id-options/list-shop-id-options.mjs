import belco from "../../belco.app.mjs";

export default {
  key: "belco-list-shop-id-options",
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
    belco,
  },
  async run({ $ }) {
    const options = await belco.propDefinitions.shopId.options.call(this.belco);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
