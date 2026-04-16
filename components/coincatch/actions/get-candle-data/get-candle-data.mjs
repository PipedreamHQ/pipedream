import coincatch from "../../coincatch.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "coincatch-get-candle-data",
  name: "Get Candle Data",
  description: "Gets candle data. [See the documentation](https://coincatch.github.io/github.io/en/mix/#get-candle-data)",
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
    granularity: {
      type: "string",
      label: "Granularity",
      description: "The type of candlestick interval",
      options: constants.GRANULARITIES,
    },
    startTime: {
      propDefinition: [
        coincatch,
        "startTime",
      ],
    },
    endTime: {
      propDefinition: [
        coincatch,
        "endTime",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of candlesticks to return",
      optional: true,
      min: 1,
      default: 100,
      max: 1000,
    },
  },
  async run({ $ }) {
    const response = await this.coincatch.getCandleData({
      $,
      params: {
        symbol: this.symbol,
        granularity: this.granularity,
        startTime: new Date(this.startTime).getTime(),
        endTime: new Date(this.endTime).getTime(),
        limit: this.limit,
      },
    });
    $.export("$summary", `Successfully retrieved ${response?.length} candle data points for \`${this.symbol}\``);
    return response;
  },
};
