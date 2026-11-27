import { defineAction } from "@pipedream/types";
import app from "../../app/google_my_business.app";
import { KEYWORDS_PAGE_SIZE } from "../../common/constants";
import {
  parseLocationId, parseMonth,
} from "../../common/utils";

const DOCS_LINK = "https://developers.google.com/my-business/reference/performance/rest/v1/locations.searchkeywords.impressions.monthly/list";
const MAX_KEYWORDS = KEYWORDS_PAGE_SIZE * 10;

export default defineAction({
  key: "google_my_business-list-search-keyword-impressions",
  name: "List Search Keyword Impressions",
  description: "List the search terms people used on Google Search and Maps before a Business Profile location appeared, with the number of impressions per term added up over a month range."
    + " Use it for questions like \"what do people search for to find us?\"."
    + " For daily counts such as clicks or direction requests, use **Get Daily Metrics Time Series** instead."
    + " Use **List Locations** first to get the location ID. Terms are lower-cased."
    + " When Google reports only a lower bound, `impressions` is null and `belowThreshold` holds that bound, meaning the real number is under it."
    + ` Google returns ${KEYWORDS_PAGE_SIZE} terms per page and this action follows pages until it has \`Max Keywords\` (up to ${MAX_KEYWORDS}); when more remain, \`nextPageToken\` is returned: run it again with that token in \`Page Token\`.`
    + " Returns `searchKeywords`, a list of `{ keyword, impressions, belowThreshold }`, and `nextPageToken`."
    + " Example: `locationId=9876543210`, `startMonth=2026-01`, `endMonth=2026-03` → up to 100 terms such as `{ keyword: \"pizza near me\", impressions: 140 }`."
    + ` [See the documentation](${DOCS_LINK})`,
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    locationId: {
      propDefinition: [
        app,
        "performanceLocationId",
      ],
    },
    startMonth: {
      type: "string",
      label: "Start Month",
      description: "First month of the range, inclusive, as `YYYY-MM`, e.g. `2026-01`. Impressions are added up over the whole range.",
    },
    endMonth: {
      type: "string",
      label: "End Month",
      description: "Last month of the range, inclusive, as `YYYY-MM`, e.g. `2026-03`. Must not be before `Start Month`.",
    },
    maxResults: {
      type: "integer",
      label: "Max Keywords",
      description: `The most search terms to return across all pages, e.g. \`200\`. Defaults to \`${KEYWORDS_PAGE_SIZE}\` (one page).`,
      optional: true,
      default: KEYWORDS_PAGE_SIZE,
      min: 1,
      max: MAX_KEYWORDS,
    },
    pageToken: {
      propDefinition: [
        app,
        "pageToken",
      ],
    },
  },
  async run({ $ }) {
    const locationId = parseLocationId(this.locationId);
    const start = parseMonth(this.startMonth, "Start Month");
    const end = parseMonth(this.endMonth, "End Month");
    if (start.year * 12 + start.month > end.year * 12 + end.month) {
      throw new Error(`\`End Month\` (${this.endMonth}) is before \`Start Month\` (${this.startMonth})`);
    }

    const {
      items, nextPageToken,
    } = await this.app.listKeywordImpressions({
      $,
      locationId,
      maxResults: this.maxResults ?? KEYWORDS_PAGE_SIZE,
      pageToken: this.pageToken,
      params: {
        "monthlyRange.start_month.year": start.year,
        "monthlyRange.start_month.month": start.month,
        "monthlyRange.end_month.year": end.year,
        "monthlyRange.end_month.month": end.month,
      },
    });

    const searchKeywords = items.map(({
      searchKeyword, insightsValue,
    }) => ({
      keyword: searchKeyword,
      impressions: insightsValue?.value !== undefined
        ? Number(insightsValue.value)
        : null,
      belowThreshold: insightsValue?.threshold !== undefined
        ? Number(insightsValue.threshold)
        : null,
    }));

    $.export("$summary", `Listed ${searchKeywords.length} search keyword${searchKeywords.length === 1
      ? ""
      : "s"}${nextPageToken
      ? " (more available, see `nextPageToken`)"
      : ""}`);

    return {
      searchKeywords,
      nextPageToken: nextPageToken ?? null,
    };
  },
});
