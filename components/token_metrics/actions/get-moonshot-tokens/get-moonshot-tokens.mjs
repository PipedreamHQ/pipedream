import tokenMetrics from "../../token_metrics.app.mjs";
import { ENDPOINTS, FILTER_DEFINITIONS } from "../../common/constants.mjs";
import { buildParams, generateFilterSummary } from "../../common/utils.mjs";

const endpoint = ENDPOINTS.MOONSHOT_TOKENS;

export default {
  key: "token_metrics-get-moonshot-tokens",
  name: "Get Moonshot Tokens",
  description: `${endpoint.description}. [See the documentation](https://developers.tokenmetrics.com/reference/moonshot-tokens)`,
  version: "0.0.1",
  type: "action",
  props: {
    tokenMetrics,
    // Filter props based on endpoint configuration and screenshot
    type: {
      ...FILTER_DEFINITIONS.type,
      description: "Accepts 'active' or 'past' to fetch respective moonshots. Defaults to 'active' if not provided",
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
      const response = await this.tokenMetrics.getMoonshotTokens({
        $,
        params,
      });

      // Generate summary using utility function
      const filterSummary = generateFilterSummary(this, endpoint.filters);
      
      // Use $ context for export
      if ($ && $.export) {
        const dataLength = response.data?.length || 0;
        const moonshotType = this.type || "active";
        $.export("$summary", `Successfully retrieved ${dataLength} ${moonshotType} moonshot tokens${filterSummary}`);
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
