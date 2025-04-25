import googleSearchConsole from "../../google_search_console.app.mjs";
import { trimIfString } from "../../common/utils.mjs";

export default {
  name: "Retrieve Site Performance Data",
  description: "Fetches search analytics from Google Search Console for a verified site.",
  key: "google_search_console-retrieve-site-performance-data",
  version: "0.0.2",
  type: "action",
  props: {
    googleSearchConsole,
    siteUrl: {
      type: "string",
      label: "Verified Site URL",
      description: "Including https:// is strongly advised",
    },
    startDate: {
      type: "string",
      label: "Start Date (YYYY-MM-DD)",
      description: "Start date of the range for which to retrieve site performance data",
    },
    endDate: {
      type: "string",
      label: "End Date (YYYY-MM-DD)",
      description: "Enddate of the range for which to retrieve site performance data",
    },
    dimensions: {
      type: "string[]",
      label: "Dimensions",
      optional: true,
      description: "e.g. ['query', 'page', 'country', 'device']",
    },
    searchType: {
      type: "string",
      label: "Search Type",
      description: "The type of search to use",
      optional: true,
      options: [
        "web",
        "image",
        "video",
        "news",
        "googleNews",
        "discover",
      ],
      default: "web",
    },
    aggregationType: {
      type: "string",
      label: "Aggregation Type",
      description: "The aggregation type to use",
      optional: true,
      options: [
        "auto",
        "byPage",
      ],
    },
    rowLimit: {
      type: "integer",
      label: "Max Rows",
      description: "Max number of rows to return",
      default: 10,
      optional: true,
    },
    startRow: {
      type: "integer",
      label: "Start Row",
      description: "Start row (for pagination)",
      optional: true,
    },
    dimensionFilterGroups: {
      type: "object",
      label: "Dimension Filters",
      optional: true,
      description: "Follow Search Console API structure for filters",
    },
    dataState: {
      type: "string",
      label: "Data State",
      description: "The data state to use",
      optional: true,
      options: [
        "all",
        "final",
      ],
      default: "final",
    },
  },
  async run({ $ }) {
    const {
      googleSearchConsole,
      siteUrl,
      dimensionFilterGroups,
      ...fields
    } = this;

    const body = Object.entries(fields).reduce((acc, [
      key,
      value,
    ]) => {
      acc[key] = trimIfString(value);
      return acc;
    }, {});

    let response;
    try {
      response = await googleSearchConsole.getSitePerformanceData({
        $,
        url: siteUrl,
        data: {
          ...body,
          dimensionFilterGroups: googleSearchConsole.parseIfJsonString(dimensionFilterGroups),
        },
      });
    } catch (error) {
      // Identify if the error was thrown by internal validation or by the API call
      const thrower = googleSearchConsole.checkWhoThrewError(error);
      throw new Error(`Failed to fetch data ( ${thrower.whoThrew} error ) : ${error.message}. `);
    };

    $.export("$summary", ` Fetched ${response.rows?.length || 0} rows of data. `);
    return response;
  },
};

