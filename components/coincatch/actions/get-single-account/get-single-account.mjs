import coincatch from "../../coincatch.app.mjs";

export default {
  key: "coincatch-get-single-account",
  name: "Get Single Account",
  description: "Gets a single account. [See the documentation](https://coincatch.github.io/github.io/en/mix/#get-single-account)",
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
    marginCoin: {
      propDefinition: [
        coincatch,
        "marginCoin",
        ({ productType }) => ({
          productType,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.coincatch.getSingleAccount({
      $,
      params: {
        symbol: this.symbol,
        marginCoin: this.marginCoin,
      },
    });
    $.export("$summary", "Successfully retrieved account details");
    return response;
  },
};
