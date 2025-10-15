import tokenMetrics from "../../token_metrics.app.mjs";
import { ENDPOINTS } from "../../common/constants.mjs";
import {
  buildParams, generateFilterSummary,
} from "../../common/utils.mjs";

const endpoint = ENDPOINTS.MOONSHOT_TOKENS;

export default {
  key: "token_metrics-get-moonshot-tokens",
  name: "Get Moonshot Tokens",
  description: `${endpoint.description}. [See the documentation](https://developers.tokenmetrics.com/v3/reference/moonshot-tokens)`,
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    tokenMetrics,
    // Filter props based on endpoint configuration and screenshot
    type: {
      propDefinition: [
        tokenMetrics,
        "type",
      ],
    },
    sortBy: {
      propDefinition: [
        tokenMetrics,
        "sortBy",
      ],
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

    const response = await this.tokenMetrics.getMoonshotTokens({
      $,
      params,
    });

    // Generate summary using utility function
    const filterSummary = generateFilterSummary(this, endpoint.filters);

    // Use $ context for export
    const dataLength = response.data?.length || 0;
    const moonshotType = this.type || "active";
    $.export("$summary", `Successfully retrieved ${dataLength} ${moonshotType} moonshot tokens${filterSummary}`);

    return response;
  },
};
