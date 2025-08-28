import tokenMetrics from "../../token_metrics.app.mjs";
import { ENDPOINTS } from "../../common/constants.mjs";
import {
  buildParams, generateFilterSummary,
} from "../../common/utils.mjs";

const endpoint = ENDPOINTS.TRADING_SIGNALS;

export default {
  key: "token_metrics-get-trading-signals",
  name: "Get Trading Signals",
  description: `${endpoint.description}. [See the documentation](https://developers.tokenmetrics.com/reference/trading-signals)`,
  version: "0.0.1",
  type: "action",
  props: {
    tokenMetrics,
    // Filter props based on endpoint configuration
    tokenId: {
      propDefinition: [
        tokenMetrics,
        "tokenId",
      ],
    },
    startDate: {
      propDefinition: [
        tokenMetrics,
        "startDate",
      ],
    },
    endDate: {
      propDefinition: [
        tokenMetrics,
        "endDate",
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
    marketCap: {
      propDefinition: [
        tokenMetrics,
        "marketCap",
      ],
    },
    volume: {
      propDefinition: [
        tokenMetrics,
        "volume",
      ],
    },
    fdv: {
      propDefinition: [
        tokenMetrics,
        "fdv",
      ],
    },
    signal: {
      propDefinition: [
        tokenMetrics,
        "signal",
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

    const response = await this.tokenMetrics.getTradingSignals({
      $,
      params,
    });

    // Generate summary using utility function
    const filterSummary = generateFilterSummary(this, endpoint.filters);

    // Use $ context for export
    $.export("$summary", `Successfully retrieved trading signals${filterSummary}`);

    return response;
  },
};
