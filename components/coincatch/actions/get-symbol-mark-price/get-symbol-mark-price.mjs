import coincatch from "../../coincatch.app.mjs";

export default {
  key: "coincatch-get-symbol-mark-price",
  name: "Get Symbol Mark Price",
  description: "Get symbol mark price. [See the documentation](https://coincatch.github.io/github.io/en/mix/#get-symbol-mark-price)",
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
    symbol: {
      propDefinition: [
        coincatch,
        "symbol",
        ({ productType }) => ({
          productType,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.coincatch.getSymbolMarkPrice({
      $,
      params: {
        symbol: this.symbol,
      },
    });
    $.export("$summary", `Successfully retrieved symbol mark price for ${this.symbol}`);
    return response;
  },
};
