import coincatch from "../../coincatch.app.mjs";

export default {
  key: "coincatch-get-single-symbol-ticker",
  name: "Get Single Symbol Ticker",
  description: "Gets single symbol ticker. [See the documentation](https://coincatch.github.io/github.io/en/mix/#get-single-symbol-ticker)",
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
    const response = await this.coincatch.getSingleSymbolTicker({
      $,
      params: {
        symbol: this.symbol,
      },
    });
    $.export("$summary", `Successfully retrieved single symbol ticker for \`${this.symbol}\``);
    return response;
  },
};
