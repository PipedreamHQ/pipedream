import tokenMetrics from "../../token_metrics.app.mjs";
import { ENDPOINTS } from "../../common/constants.mjs";
import {
  buildParams, generateFilterSummary,
} from "../../common/utils.mjs";

const endpoint = ENDPOINTS.TOP_MARKET_CAP_TOKENS;

export default {
  key: "token_metrics-get-top-market-cap-tokens",
  name: "Get Top Market Cap Tokens",
  description: `${endpoint.description}. [See the documentation](https://developers.tokenmetrics.com/v3/reference/top-market-cap-tokens)`,
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    tokenMetrics,
    // Filter props based on endpoint configuration and API documentation
    topK: {
      propDefinition: [
        tokenMetrics,
        "topK",
      ],
      description: "Specifies the number of top cryptocurrencies to retrieve, based on their market capitalization. Example: `100`",
    },
    expand: {
      propDefinition: [
        tokenMetrics,
        "expand",
      ],
    },
  },
  async run({ $ }) {
    // Build parameters using utility function
    const params = buildParams(this, endpoint.filters);

    const response = await this.tokenMetrics.getTopMarketCapTokens({
      $,
      params,
    });

    // Generate summary using utility function
    const filterSummary = generateFilterSummary(this, endpoint.filters);

    // Use $ context for export
    const dataLength = response.data?.length || 0;
    $.export("$summary", `Successfully retrieved ${dataLength} top market cap tokens${filterSummary}`);

    return response;
  },
};
