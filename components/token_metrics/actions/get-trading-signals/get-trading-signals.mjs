import tokenMetrics from "../../token_metrics.app.mjs";
import { ENDPOINTS, FILTER_DEFINITIONS } from "../../common/constants.mjs";
import { buildParams, generateFilterSummary } from "../../common/utils.mjs";

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
    tokenId: FILTER_DEFINITIONS.token_id,
    startDate: FILTER_DEFINITIONS.start_date,
    endDate: FILTER_DEFINITIONS.end_date,
    symbol: FILTER_DEFINITIONS.symbol,
    category: FILTER_DEFINITIONS.category,
    exchange: FILTER_DEFINITIONS.exchange,
    marketCap: FILTER_DEFINITIONS.market_cap,
    volume: FILTER_DEFINITIONS.volume,
    fdv: FILTER_DEFINITIONS.fdv,
    signal: FILTER_DEFINITIONS.signal,
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

    try {
      const response = await this.tokenMetrics.getTradingSignals({
        $,
        params,
      });

      // Generate summary using utility function
      const filterSummary = generateFilterSummary(this, endpoint.filters);
      
      // Use $ context for export
      if ($ && $.export) {
        $.export("$summary", `Successfully retrieved trading signals${filterSummary}`);
      }
      
      return response;
    } catch (error) {
      // Enhanced error handling
      const errorMessage = error.response?.data?.message || error.message || "An error occurred";
      const statusCode = error.response?.status;
      
      if ($ && $.export) {
        $.export("$summary", `Error: ${errorMessage}`);
      }
      
      // Throw a more descriptive error
      throw new Error(`Token Metrics API Error (${statusCode || 'Unknown'}): ${errorMessage}`);
    }
  },
};
