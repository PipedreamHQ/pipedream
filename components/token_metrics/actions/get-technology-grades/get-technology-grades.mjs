import tokenMetrics from "../../token_metrics.app.mjs";
import { ENDPOINTS } from "../../common/constants.mjs";
import {
  buildParams, generateFilterSummary,
} from "../../common/utils.mjs";

const endpoint = ENDPOINTS.TECHNOLOGY_GRADES;

export default {
  key: "token_metrics-get-technology-grades",
  name: "Get Technology Grades",
  description: `${endpoint.description}. [See the documentation](https://developers.tokenmetrics.com/v3/reference/technology-grade)`,
  version: "0.1.0",
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
    slug: {
      propDefinition: [
        tokenMetrics,
        "slug",
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

    const response = await this.tokenMetrics.getTechnologyGrades({
      $,
      params,
    });

    // Generate summary using utility function
    const filterSummary = generateFilterSummary(this, endpoint.filters);

    // Use $ context for export
    const dataLength = response.data?.length || 0;
    $.export("$summary", `Successfully retrieved technology grades for ${dataLength} tokens${filterSummary}`);

    return response;
  },
};
