import tokenMetrics from "../../token_metrics.app.mjs";
import { ENDPOINTS } from "../../common/constants.mjs";
import {
  buildParams, generateFilterSummary,
} from "../../common/utils.mjs";

const endpoint = ENDPOINTS.TM_GRADES_HISTORICAL;

export default {
  key: "token_metrics-get-tm-grades-historical",
  name: "Get TM Grades Historical",
  description: `${endpoint.description}. [See the documentation](https://developers.tokenmetrics.com/reference/tm-grade-history)`,
  version: "0.0.1",
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
      description: "Crypto Asset Names (e.g., Bitcoin, Ethereum) to filter results. Select token names.",
    },
    symbol: {
      propDefinition: [
        tokenMetrics,
        "symbol",
      ],
    },
    startDate: {
      propDefinition: [
        tokenMetrics,
        "startDate",
      ],
      description: "Start Date accepts date as a string - `YYYY-MM-DD` format. Example: `2025-07-01`",
    },
    endDate: {
      propDefinition: [
        tokenMetrics,
        "endDate",
      ],
      description: "End Date accepts date as a string - `YYYY-MM-DD` format. Example: `2025-07-05`",
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

    const response = await this.tokenMetrics.getTmGradesHistorical({
      $,
      params,
    });

    // Generate summary using utility function
    const filterSummary = generateFilterSummary(this, endpoint.filters);

    // Use $ context for export
    const dataLength = response.data?.length || 0;
    $.export("$summary", `Successfully retrieved historical TM grades for ${dataLength} records${filterSummary}`);

    return response;
  },
};
