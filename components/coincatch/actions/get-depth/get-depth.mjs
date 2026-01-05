import coincatch from "../../coincatch.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "coincatch-get-depth",
  name: "Get Depth",
  description: "Gets depth data. [See the documentation](https://coincatch.github.io/github.io/en/mix/#get-depth)",
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
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of depth data to return. Default: `100`",
      optional: true,
      options: constants.MARKET_DEPTH_LIMITS,
      default: 100,
    },
  },
  async run({ $ }) {
    const response = await this.coincatch.getDepth({
      $,
      params: {
        symbol: this.symbol,
        limit: this.limit,
      },
    });
    $.export("$summary", `Successfully retrieved depth data for \`${this.symbol}\``);
    return response;
  },
};
