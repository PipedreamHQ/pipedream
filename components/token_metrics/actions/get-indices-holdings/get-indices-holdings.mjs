import tokenMetrics from "../../token_metrics.app.mjs";
import { ENDPOINTS } from "../../common/constants.mjs";
import {
  buildParams, generateFilterSummary,
} from "../../common/utils.mjs";

const endpoint = ENDPOINTS.INDICES_HOLDINGS;

export default {
  key: "token_metrics-get-indices-holdings",
  name: "Get Indices Holdings",
  description: `${endpoint.description}. [See the documentation](https://developers.tokenmetrics.com/v3/reference/indices-holdings)`,
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
  },
  async run({ $ }) {
    // Build parameters using utility function
    const params = buildParams(this, endpoint.filters);

    const response = await this.tokenMetrics.getIndicesHoldings({
      $,
      params,
    });

    // Generate summary using utility function
    const filterSummary = generateFilterSummary(this, endpoint.filters);

    // Use $ context for export
    const dataLength = response.data?.length || 0;
    $.export("$summary", `Successfully retrieved holdings for index with ${dataLength} tokens${filterSummary}`);

    return response;
  },
};
