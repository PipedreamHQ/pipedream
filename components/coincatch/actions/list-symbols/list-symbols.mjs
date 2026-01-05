import coincatch from "../../coincatch.app.mjs";

export default {
  key: "coincatch-list-symbols",
  name: "List Symbols",
  description: "List all symbols. [See the documentation](https://coincatch.github.io/github.io/en/mix/#get-all-symbols)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    coincatch,
    productType: {
      propDefinition: [
        coincatch,
        "productType",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.coincatch.listSymbols({
      $,
      params: {
        productType: this.productType,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data.length} symbols`);
    return response;
  },
};
