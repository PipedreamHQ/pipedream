import tokenMetrics from "../../token_metrics.app.mjs";
import { ENDPOINTS } from "../../common/constants.mjs";
import {
  buildParams, generateFilterSummary,
} from "../../common/utils.mjs";

const endpoint = ENDPOINTS.CORRELATION;

export default {
  key: "token_metrics-get-correlation",
  name: "Get Correlation",
  description: `${endpoint.description}. [See the documentation](https://developers.tokenmetrics.com/reference/correlation)`,
  version: "0.0.1",
  type: "action",
  props: {
    tokenMetrics,
    // Filter props based on endpoint configuration and API documentation
    tokenId: {
      propDefinition: [
        tokenMetrics,
        "tokenId",
      ],
    },
    symbol: {
      propDefinition: [
        tokenMetrics,
        "symbol",
      ],
    },
    category: {
      propDefinition: [
        tokenMetrics,
        "category",
      ],
      description: "Select categories to filter results. Example: `layer-1,nft`",
    },
    exchange: {
      propDefinition: [
        tokenMetrics,
        "exchange",
      ],
      description: "Select exchanges to filter results. Example: `gate,binance`",
    },
    // Pagination props
    limit: {
      propDefinition: [
        tokenMetrics,
        "limit",
      ],
      description: "Limit the number of items in response. Defaults to 50",
      default: 50,
    },
    page: {
      propDefinition: [
        tokenMetrics,
        "page",
      ],
      min: 1,
      default: 1,
    },
  },
  async run({ $ }) {
    // Build parameters using utility function
    const params = buildParams(this, endpoint.filters);

    const response = await this.tokenMetrics.getCorrelation({
      $,
      params,
    });

    // Generate summary using utility function
    const filterSummary = generateFilterSummary(this, endpoint.filters);

    // Use $ context for export
    const dataLength = response.data?.length || 0;
    $.export("$summary", `Successfully retrieved correlation data for ${dataLength} tokens${filterSummary}`);

    return response;
  },
};
