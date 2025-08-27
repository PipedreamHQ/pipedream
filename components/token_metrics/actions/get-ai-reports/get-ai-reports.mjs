import tokenMetrics from "../../token_metrics.app.mjs";
import { ENDPOINTS } from "../../common/constants.mjs";
import {
  buildParams, generateFilterSummary,
} from "../../common/utils.mjs";

const endpoint = ENDPOINTS.AI_REPORTS;

export default {
  key: "token_metrics-get-ai-reports",
  name: "Get AI Reports",
  description: `${endpoint.description}. [See the documentation](https://developers.tokenmetrics.com/reference/ai-reports)`,
  version: "0.0.1",
  type: "action",
  props: {
    tokenMetrics,
    // Filter props using propDefinitions from the app
    tokenId: {
      propDefinition: [
        tokenMetrics,
        "tokenId",
      ],
      description: "Select Token IDs to get AI reports for. Example: `37493,3484`",
    },
    symbol: {
      propDefinition: [
        tokenMetrics,
        "symbol",
      ],
      description: "Select token symbols to get AI reports for. Example: `APX,PAAL`",
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

    const response = await this.tokenMetrics.getAiReports({
      $,
      params,
    });

    // Generate summary using utility function
    const filterSummary = generateFilterSummary(this, endpoint.filters);

    // Use $ context for export
    const dataLength = response.data?.length || 0;
    $.export("$summary", `Successfully retrieved AI reports for ${dataLength} tokens${filterSummary}`);

    return response;
  },
};
