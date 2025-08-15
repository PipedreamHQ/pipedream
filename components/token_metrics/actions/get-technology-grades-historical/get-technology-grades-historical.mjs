import tokenMetrics from "../../token_metrics.app.mjs";
import { ENDPOINTS, FILTER_DEFINITIONS } from "../../common/constants.mjs";
import { buildParams, generateFilterSummary } from "../../common/utils.mjs";

const endpoint = ENDPOINTS.TECHNOLOGY_GRADES_HISTORICAL;

export default {
  key: "token_metrics-get-technology-grades-historical",
  name: "Get Technology Grades Historical",
  description: `${endpoint.description}. [See the documentation](https://developers.tokenmetrics.com/reference/technology-grade-history)`,
  version: "0.0.1",
  type: "action",
  props: {
    tokenMetrics,
    // Filter props based on endpoint configuration and API documentation
    tokenId: {
      ...FILTER_DEFINITIONS.token_id,
      description: "Click here to access the list of token IDs. Example: 3375",
    },
    tokenName: {
      ...FILTER_DEFINITIONS.token_name,
      description: "Crypto Asset Names (e.g., Bitcoin, Ethereum). Click here to access the list of token names.",
    },
    symbol: {
      ...FILTER_DEFINITIONS.symbol,
      description: "Click here to access the list of token symbols. Example: BTC,ETH",
    },
    startDate: {
      ...FILTER_DEFINITIONS.start_date,
      description: "Start Date accepts date as a string - YYYY-MM-DD format. Example: 2025-07-01",
    },
    endDate: {
      ...FILTER_DEFINITIONS.end_date,
      description: "End Date accepts date as a string - YYYY-MM-DD format. Example: 2025-07-05",
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
      const response = await this.tokenMetrics.getTechnologyGradesHistorical({
        $,
        params,
      });

      // Generate summary using utility function
      const filterSummary = generateFilterSummary(this, endpoint.filters);
      
      // Use $ context for export
      if ($ && $.export) {
        const dataLength = response.data?.length || 0;
        $.export("$summary", `Successfully retrieved historical technology grades for ${dataLength} records${filterSummary}`);
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
