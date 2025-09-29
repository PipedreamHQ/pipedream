import tokenMetrics from "../../token_metrics.app.mjs";
import { ENDPOINTS } from "../../common/constants.mjs";
import {
  buildParams, generateFilterSummary,
} from "../../common/utils.mjs";

const endpoint = ENDPOINTS.MARKET_METRICS;

export default {
  key: "token_metrics-get-market-metrics",
  name: "Get Market Metrics",
  description: `${endpoint.description}. [See the documentation](https://developers.tokenmetrics.com/v3/reference/market-metrics)`,
  version: "0.1.0",
  type: "action",
  props: {
    tokenMetrics,
    // Filter props based on endpoint configuration and API documentation
    startDate: {
      propDefinition: [
        tokenMetrics,
        "startDate",
      ],
      description: "Start Date accepts date as a string - `YYYY-MM-DD` format. Example: `2023-10-01`",
    },
    endDate: {
      propDefinition: [
        tokenMetrics,
        "endDate",
      ],
      description: "End Date accepts date as a string - `YYYY-MM-DD` format. Example: `2023-10-10`",
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

    const response = await this.tokenMetrics.getMarketMetrics({
      $,
      params,
    });

    // Generate summary using utility function
    const filterSummary = generateFilterSummary(this, endpoint.filters);

    // Use $ context for export
    const dataLength = response.data?.length || 0;
    $.export("$summary", `Successfully retrieved market metrics for ${dataLength} records${filterSummary}`);

    return response;
  },
};
