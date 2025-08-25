import mboum from "../../mboum.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "mboum-get-modules",
  name: "Get Stock Modules",
  description: "Get comprehensive stock data modules including financial metrics, statistics, and company information. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v1-markets-stock-modules)",
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
    module: {
      type: "string",
      label: "Module",
      description: "Specific module to retrieve data for",
      options: constants.STOCK_MODULES,
    },
    timeframe: {
      type: "string",
      label: "Timeframe",
      description: "Timeframe for the data",
      options: [
        "annually",
        "quarterly",
        "trailing",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mboum.getModules({
      $,
      params: {
        ticker: this.ticker,
        module: this.module,
        timeframe: this.timeframe,
      },
    });

    const moduleText = this.module
      ? ` (${this.module} module)`
      : "";
    $.export("$summary", `Successfully retrieved stock modules for ${this.ticker}${moduleText}`);
    return response;
  },
};
