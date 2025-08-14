import tokenMetrics from "../../token_metrics.app.mjs";
import { ENDPOINTS, FILTER_DEFINITIONS } from "../../common/constants.mjs";
import { buildParams, generateFilterSummary } from "../../common/utils.mjs";

const endpoint = ENDPOINTS.MARKET_METRICS;

export default {
  key: "token_metrics-get-market-metrics",
  name: "Get Market Metrics",
  description: `${endpoint.description}. [See the documentation](https://developers.tokenmetrics.com/reference/market-metrics)`,
  version: "0.0.1",
  type: "action",
  props: {
    tokenMetrics,
    // Filter props based on endpoint configuration and API documentation
    startDate: {
      ...FILTER_DEFINITIONS.start_date,
      description: "Start Date accepts date as a string - YYYY-MM-DD format. Example: 2023-10-01",
    },
    endDate: {
      ...FILTER_DEFINITIONS.end_date,
      description: "End Date accepts date as a string - YYYY-MM-DD format. Example: 2023-10-10",
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
      description: "Enables pagination and data retrieval control by skipping a specified number of items before fetching data. Page should be a non-negative integer, with 1 indicating the beginning of the dataset. Defaults to 1",
      default: 1,
    },
  },
  async run({ $ }) {
    // Build parameters using utility function
    const params = buildParams(this, endpoint.filters);

    try {
      const response = await this.tokenMetrics.getMarketMetrics({
        $,
        params,
      });

      // Generate summary using utility function
      const filterSummary = generateFilterSummary(this, endpoint.filters);
      
      // Use $ context for export
      if ($ && $.export) {
        const dataLength = response.data?.length || 0;
        $.export("$summary", `Successfully retrieved market metrics for ${dataLength} records${filterSummary}`);
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
