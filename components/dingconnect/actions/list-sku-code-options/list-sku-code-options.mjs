import dingconnect from "../../dingconnect.app.mjs";

export default {
  key: "dingconnect-list-sku-code-options",
  name: "List SKU Code Options",
  description: "Retrieves available options for the SKU Code field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dingconnect,
  },
  async run({ $ }) {
    const options = await dingconnect.propDefinitions.skuCode.options.call(this.dingconnect);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
