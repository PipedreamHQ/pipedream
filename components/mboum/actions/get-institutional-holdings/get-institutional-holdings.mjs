import mboum from "../../mboum.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "mboum-get-institutional-holdings",
  name: "Get Institutional Holdings",
  description: "Get institutional ownership data including top institutional holders and their position changes. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v2-markets-stock-institutional-holdings)",
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
      label: "Type",
      description: "Type of institutional holdings to retrieve",
      options: constants.INTERNATIONAL_HOLDINGS_TYPES,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of data points to return",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mboum.getInstitutionalHoldings({
      $,
      params: {
        ticker: this.ticker,
        type: this.type,
        limit: this.limit,
      },
    });

    $.export("$summary", `Successfully retrieved institutional holdings for ${this.ticker}`);
    return response;
  },
};
