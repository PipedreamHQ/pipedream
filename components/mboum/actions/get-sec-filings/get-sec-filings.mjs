import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-sec-filings",
  name: "Get SEC Filings",
  description: "Get SEC filings data including 10-K, 10-Q, 8-K, and other regulatory filings. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v2-markets-stock-sec-filings)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mboum,
    ticker: {
      propDefinition: [
        mboum,
        "ticker",
      ],
    },
    type: {
      type: "string",
      label: "Filing Type",
      description: "Type of SEC filing to retrieve",
      options: [
        "FORM-4",
        "ALL",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of data points to return",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mboum.getSecFilings({
      $,
      params: {
        ticker: this.ticker,
        type: this.type,
        limit: this.limit,
      },
    });

    $.export("$summary", `Successfully retrieved SEC filings for ${this.ticker}`);
    return response;
  },
};
