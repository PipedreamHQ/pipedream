import tokenMetrics from "../../token_metrics.app.mjs";
import { ENDPOINTS } from "../../common/constants.mjs";
import {
  buildParams, generateFilterSummary,
} from "../../common/utils.mjs";

const endpoint = ENDPOINTS.QUANTMETRICS;

export default {
  key: "token_metrics-get-quantmetrics",
  name: "Get Quantmetrics",
  description: `${endpoint.description}. [See the documentation](https://developers.tokenmetrics.com/v3/reference/quantmetrics)`,
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
    slug: {
      propDefinition: [
        tokenMetrics,
        "slug",
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
      description: "Select exchanges to filter results. Example: `binance,gate`",
    },
    marketCap: {
      propDefinition: [
        tokenMetrics,
        "marketCap",
      ],
      description: "Minimum MarketCap in $. Example: `1000000000`",
    },
    volume: {
      propDefinition: [
        tokenMetrics,
        "volume",
      ],
      description: "Minimum 24h trading volume in $. Example: `1000000000`",
    },
    fdv: {
      propDefinition: [
        tokenMetrics,
        "fdv",
      ],
      description: "Minimum fully diluted valuation in $. Example: `1000000000`",
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

    const response = await this.tokenMetrics.getQuantmetrics({
      $,
      params,
    });

    // Generate summary using utility function
    const filterSummary = generateFilterSummary(this, endpoint.filters);

    // Use $ context for export
    const dataLength = response.data?.length || 0;
    $.export("$summary", `Successfully retrieved quantmetrics for ${dataLength} tokens${filterSummary}`);

    return response;
  },
};
