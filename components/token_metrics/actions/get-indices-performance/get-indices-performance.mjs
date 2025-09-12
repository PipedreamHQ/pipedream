import tokenMetrics from "../../token_metrics.app.mjs";
import { ENDPOINTS } from "../../common/constants.mjs";
import {
  buildParams, generateFilterSummary,
} from "../../common/utils.mjs";

const endpoint = ENDPOINTS.INDICES_PERFORMANCE;

export default {
  key: "token_metrics-get-indices-performance",
  name: "Get Indices Performance",
  description: `${endpoint.description}. [See the documentation](https://developers.tokenmetrics.com/reference/indices-performance)`,
  version: "0.0.1",
  type: "action",
  props: {
    tokenMetrics,
    // Filter props based on endpoint configuration and API documentation
    id: {
      propDefinition: [
        tokenMetrics,
        "id",
      ],
      description: "ID of the index. Example: `1`",
    },
    startDate: {
      propDefinition: [
        tokenMetrics,
        "startDate",
      ],
      description: "Start Date accepts date as a string - `YYYY-MM-DD` format. Example: `2025-01-01`",
    },
    endDate: {
      propDefinition: [
        tokenMetrics,
        "endDate",
      ],
      description: "End Date accepts date as a string - `YYYY-MM-DD` format. Example: `2025-06-01`",
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

    const response = await this.tokenMetrics.getIndicesPerformance({
      $,
      params,
    });

    // Generate summary using utility function
    const filterSummary = generateFilterSummary(this, endpoint.filters);

    // Use $ context for export
    const dataLength = response.data?.length || 0;
    $.export("$summary", `Successfully retrieved historical performance data for index with ${dataLength} data points${filterSummary}`);

    return response;
  },
};
