import coincatch from "../../coincatch.app.mjs";

export default {
  key: "coincatch-get-position-tier",
  name: "Get Position Tier",
  description: "Gets position tier. [See the documentation](https://coincatch.github.io/github.io/en/mix/#get-position-tier)",
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
    const response = await this.coincatch.getPositionTier({
      $,
      params: {
        symbol: this.symbol,
        productType: this.productType,
      },
    });
    $.export("$summary", `Successfully retrieved position tier for \`${this.symbol}\``);
    return response;
  },
};
