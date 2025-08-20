import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-options",
  name: "Get Options Data",
  description: "Get comprehensive options data including prices, Greeks, and market metrics. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v3-markets-options)",
  version: "0.0.1",
  type: "action",
  props: {
    mboum,
    ticker: {
      propDefinition: [
        mboum,
        "ticker",
      ],
    },
    expiration: {
      type: "string",
      label: "Expiration Date",
      description: "Enter an expiration date, format: YYYY-MM-DD",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mboum.getOptions({
      $,
      params: {
        ticker: this.ticker,
        expiration: this.expiration,
      },
    });

    $.export("$summary", `Successfully retrieved options data for ${this.ticker}`);
    return response;
  },
};
