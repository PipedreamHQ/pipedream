import app from "../../bitget.app.mjs";

export default {
  key: "bitget-future-market-get-history-funding-rate",
  name: "Future - Market - Get History Funding Rate",
  description: "Retrieve historical funding rate for a contract symbol. [See the documentation](https://www.bitget.com/api-doc/contract/market/Get-History-Funding-Rate)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
      optional: false,
      propDefinition: [
        app,
        "ticker",
        ({ productType }) => ({
          productType,
        }),
      ],
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Number of records per page",
      optional: true,
    },
    pageNo: {
      type: "integer",
      label: "Page Number",
      description: "Page number for pagination",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      symbol,
      productType,
      pageSize,
      pageNo,
    } = this;

    const response = await app.getFutureMarketHistoryFundingRate({
      $,
      params: {
        symbol,
        productType,
        pageSize,
        pageNo,
      },
    });

    $.export("$summary", `Successfully retrieved historical funding rate for \`${symbol}\``);
    return response;
  },
};
