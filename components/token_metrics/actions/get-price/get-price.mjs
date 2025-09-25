import tokenMetrics from "../../token_metrics.app.mjs";
import { ENDPOINTS } from "../../common/constants.mjs";
import {
  buildParams, generateFilterSummary,
} from "../../common/utils.mjs";

const endpoint = ENDPOINTS.PRICE;

export default {
  key: "token_metrics-get-price",
  name: "Get Price",
  description: `${endpoint.description}. [See the documentation](https://developers.tokenmetrics.com/v3/reference/price)`,
  version: "0.1.0",
  type: "action",
  props: {
    tokenMetrics,
    // Filter props using propDefinitions from the app
    tokenId: {
      propDefinition: [
        tokenMetrics,
        "tokenId",
      ],
      description: "Select Token IDs to get prices for. Example: `3375,3306`",
    },
    tokenName: {
      propDefinition: [
        tokenMetrics,
        "tokenName",
      ],
    },
    symbol: {
      propDefinition: [
        tokenMetrics,
        "symbol",
      ],
    },
    slug: {
      propDefinition: [
        tokenMetrics,
        "slug",
      ],
    },
    // Pagination props
    limit: {
      propDefinition: [
        tokenMetrics,
        "limit",
      ],
    },
    page: {
      propDefinition: [
        tokenMetrics,
        "page",
      ],
    },
  },
  async run({ $ }) {
    // Build parameters using utility function
    const params = buildParams(this, endpoint.filters);

    const response = await this.tokenMetrics.getPrice({
      $,
      params,
    });

    // Generate summary using utility function
    const filterSummary = generateFilterSummary(this, endpoint.filters);

    // Use $ context for export
    const dataLength = response.data?.length || 0;
    $.export("$summary", `Successfully retrieved ${dataLength} price records${filterSummary}`);

    return response;
  },
};
