import tokenMetrics from "../../token_metrics.app.mjs";
import { ENDPOINTS } from "../../common/constants.mjs";
import {
  buildParams, generateFilterSummary,
} from "../../common/utils.mjs";

const endpoint = ENDPOINTS.TOKENS;

export default {
  key: "token_metrics-get-tokens",
  name: "Get Tokens",
  description: `${endpoint.description}. [See the documentation](https://developers.tokenmetrics.com/v3/reference/tokens)`,
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    tokenMetrics,
    // Dynamically add filter props based on endpoint configuration
    tokenId: {
      propDefinition: [
        tokenMetrics,
        "tokenId",
      ],
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
    category: {
      propDefinition: [
        tokenMetrics,
        "category",
      ],
    },
    exchange: {
      propDefinition: [
        tokenMetrics,
        "exchange",
      ],
    },
    blockchainAddress: {
      propDefinition: [
        tokenMetrics,
        "blockchainAddress",
      ],
    },
    slug: {
      propDefinition: [
        tokenMetrics,
        "slug",
      ],
    },
    expand: {
      propDefinition: [
        tokenMetrics,
        "expand",
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

    const response = await this.tokenMetrics.getTokens({
      $,
      params,
    });

    // Generate summary using utility function
    const filterSummary = generateFilterSummary(this, endpoint.filters);

    // Use $ context for export
    $.export("$summary", `Successfully retrieved tokens list${filterSummary}`);

    return response;
  },
};
