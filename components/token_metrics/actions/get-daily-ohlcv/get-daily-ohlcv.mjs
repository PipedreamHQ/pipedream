import tokenMetrics from "../../token_metrics.app.mjs";
import { ENDPOINTS } from "../../common/constants.mjs";
import {
  buildParams, generateFilterSummary,
} from "../../common/utils.mjs";

const endpoint = ENDPOINTS.DAILY_OHLCV;

export default {
  key: "token_metrics-get-daily-ohlcv",
  name: "Get Daily OHLCV",
  description: `${endpoint.description}. [See the documentation](https://developers.tokenmetrics.com/reference/daily-ohlcv)`,
  version: "0.0.1",
  type: "action",
  props: {
    tokenMetrics,
    // Filter props based on endpoint configuration and screenshot
    tokenId: {
      propDefinition: [
        tokenMetrics,
        "tokenId",
      ],
    },
    symbol: {
      propDefinition: [
        tokenMetrics,
        "symbol",
      ],
    },
    tokenName: {
      propDefinition: [
        tokenMetrics,
        "tokenName",
      ],
      description: "Select crypto asset names to filter results. Example: `Bitcoin`",
    },
    startDate: {
      propDefinition: [
        tokenMetrics,
        "startDate",
      ],
      description: "Start Date accepts date as a string - `YYYY-MM-DD` format. Note: The Start Date cannot be earlier than the past 30 days from the current date. Example: `2025-01-01`",
    },
    endDate: {
      propDefinition: [
        tokenMetrics,
        "endDate",
      ],
      description: "End Date accepts date as a string - `YYYY-MM-DD` format. Example: `2025-01-23`",
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

    const response = await this.tokenMetrics.getDailyOhlcv({
      $,
      params,
    });

    // Generate summary using utility function
    const filterSummary = generateFilterSummary(this, endpoint.filters);

    // Use $ context for export
    const dataLength = response.data?.length || 0;
    $.export("$summary", `Successfully retrieved ${dataLength} daily OHLCV records${filterSummary}`);

    return response;
  },
};
