import app from "../../bitget.app.mjs";

export default {
  key: "bitget-future-market-get-all-symbols-contracts",
  name: "Future - Market - Get All Symbols Contracts",
  description: "Retrieve all contract symbols by product type. [See the documentation](https://www.bitget.com/api-doc/contract/market/Get-All-Symbols-Contracts)",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    productType: {
      propDefinition: [
        app,
        "productType",
      ],
    },
    symbol: {
      propDefinition: [
        app,
        "ticker",
        ({ productType }) => ({
          productType,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      symbol,
      productType,
    } = this;

    const response = await app.getFutureMarketAllSymbolsContracts({
      $,
      params: {
        symbol,
        productType,
      },
    });

    $.export("$summary", `Successfully retrieved all contract symbols for product type \`${productType}\``);
    return response;
  },
};
