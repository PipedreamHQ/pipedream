// x-pd-ai: optimized
import { defineAction } from "@pipedream/types";
import app from "../../app/google_my_business.app";
import { ListSearchKeywordImpressionsParams } from "../../common/requestParams";
import { SEARCH_KEYWORDS_PAGE_SIZE } from "../../common/constants";
import {
  assertMonthOrder, parseMonth,
} from "../../common/utils";

const DOCS_LINK = "https://developers.google.com/my-business/reference/performance/rest/v1/locations.searchkeywords.impressions.monthly/list";

export default defineAction({
  key: "google_my_business-list-search-keyword-impressions",
  name: "List Search Keyword Impressions",
  description: `List the search terms people used to find a location on Google, aggregated by month, along with how many times each one led to an impression. Use **Get Daily Metrics Time Series** to see the resulting views, calls, or clicks. [See the documentation](${DOCS_LINK})`,
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    location: {
      propDefinition: [
        app,
        "location",
      ],
    },
    startMonth: {
      type: "string",
      label: "Start Month",
      description: "Start of the month range, in `YYYY-MM` format (e.g. `2026-01`). The range must not exceed 18 months.",
    },
    endMonth: {
      type: "string",
      label: "End Month",
      description: "End of the month range, in `YYYY-MM` format (e.g. `2026-06`).",
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: `Max amount of search keywords to retrieve. Each request can retrieve up to ${SEARCH_KEYWORDS_PAGE_SIZE} keywords.`,
      optional: true,
      default: SEARCH_KEYWORDS_PAGE_SIZE,
      min: 1,
      max: SEARCH_KEYWORDS_PAGE_SIZE * 10,
    },
  },
  async run({ $ }) {
    const {
      location, startMonth, endMonth, maxResults,
    } = this;

    const start = parseMonth(startMonth, "Start Month");
    const end = parseMonth(endMonth, "End Month");
    assertMonthOrder(start, end, "Start Month", "End Month");

    const params: ListSearchKeywordImpressionsParams = {
      $,
      location,
      maxPerPage: SEARCH_KEYWORDS_PAGE_SIZE,
      maxResults,
      params: {
        "monthlyRange.start_month.year": start.year,
        "monthlyRange.start_month.month": start.month,
        "monthlyRange.end_month.year": end.year,
        "monthlyRange.end_month.month": end.month,
      },
    };

    const response = await this.app.listSearchKeywordImpressionsMonthly(params);

    $.export("$summary", `Successfully listed ${response.length} search keyword${response.length !== 1
      ? "s"
      : ""}`);

    return response;
  },
});
