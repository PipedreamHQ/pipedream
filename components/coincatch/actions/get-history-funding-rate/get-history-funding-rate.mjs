import coincatch from "../../coincatch.app.mjs";

export default {
  key: "coincatch-get-history-funding-rate",
  name: "Get History Funding Rate",
  description: "Get history funding rate. [See the documentation](https://coincatch.github.io/github.io/en/mix/#get-history-funding-rate)",
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
    pageSize: {
      propDefinition: [
        coincatch,
        "pageSize",
      ],
    },
    pageNumber: {
      propDefinition: [
        coincatch,
        "pageNumber",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.coincatch.getHistoryFundingRate({
      $,
      params: {
        productType: this.productType,
        symbol: this.symbol,
        pageSize: this.pageSize,
        pageNo: this.pageNumber,
      },
    });
    $.export("$summary", `Successfully retrieved history funding rate for ${this.symbol}`);
    return response;
  },
};
