import tokenMetrics from "../../token_metrics.app.mjs";
import { ENDPOINTS } from "../../common/constants.mjs";
import {
  buildParams, generateFilterSummary,
} from "../../common/utils.mjs";

const endpoint = ENDPOINTS.CRYPTO_INVESTORS;

export default {
  key: "token_metrics-get-crypto-investors",
  name: "Get Crypto Investors",
  description: `${endpoint.description}. [See the documentation](https://developers.tokenmetrics.com/reference/crypto-investors)`,
  version: "0.0.1",
  type: "action",
  props: {
    tokenMetrics,
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

    const response = await this.tokenMetrics.getCryptoInvestors({
      $,
      params,
    });

    // Generate summary using utility function
    const filterSummary = generateFilterSummary(this, endpoint.filters);

    // Use $ context for export
    const dataLength = response.data?.length || 0;
    $.export("$summary", `Successfully retrieved ${dataLength} crypto investors${filterSummary}`);

    return response;
  },
};
