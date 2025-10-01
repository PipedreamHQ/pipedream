import googleSearchConsole from "../../google_search_console.app.mjs";
import { trimIfString } from "../../common/utils.mjs";

export default {
  name: "Retrieve Site Performance Data",
  description: "Fetches search analytics from Google Search Console for a verified site.",
  key: "google_search_console-retrieve-site-performance-data",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    googleSearchConsole,
    siteUrl: {
      propDefinition: [
        googleSearchConsole,
        "siteUrl",
      ],
      description: "Select a verified site from your Google Search Console. For subdomains, select the domain property and use dimension filters.",
    },
    startDate: {
      type: "string",
      label: "Start Date (YYYY-MM-DD)",
      description: "Start date of the range for which to retrieve site performance data",
    },
    endDate: {
      type: "string",
      label: "End Date (YYYY-MM-DD)",
      description: "End date of the range for which to retrieve site performance data",
    },
    dimensions: {
      type: "string[]",
      label: "Dimensions",
      optional: true,
      description: "e.g. ['query', 'page', 'country', 'device']",
      options: [
        "country",
        "device",
        "page",
        "query",
        "searchAppearance",
        "date",
      ],
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
    subdomainFilter: {
      type: "string",
      label: "Subdomain Filter",
      optional: true,
      description: "Filter results to a specific subdomain when using a domain property (e.g., `https://subdomain.example.com`). This will include all subpages of the subdomain.",
    },
    filterDimension: {
      type: "string",
      label: "Filter Dimension",
      optional: true,
      description: "Dimension to filter by (defaults to page when subdomain filter is used). Using 'page' will match the subdomain and all its subpages.",
      options: [
        "country",
        "device",
        "page",
        "query",
      ],
      default: "page",
    },
    filterOperator: {
      type: "string",
      label: "Filter Operator",
      optional: true,
      description: "Operator to use for filtering (defaults to contains when subdomain filter is used)",
      options: [
        "contains",
        "equals",
        "notContains",
        "notEquals",
        "includingRegex",
        "excludingRegex",
      ],
      default: "contains",
    },
    advancedDimensionFilters: {
      type: "object",
      label: "Advanced Dimension Filters",
      optional: true,
      description: "For advanced use cases: custom dimension filter groups following Search Console API structure.",
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
      subdomainFilter,
      filterDimension,
      filterOperator,
      advancedDimensionFilters,
      ...fields
    } = this;

    const body = Object.entries(fields).reduce((acc, [
      key,
      value,
    ]) => {
      acc[key] = trimIfString(value);
      return acc;
    }, {});

    // Build dimension filters based on user input
    let dimensionFilterGroups;

    if (subdomainFilter) {
      // If user provided a subdomain filter, create the filter structure
      dimensionFilterGroups = {
        filterGroups: [
          {
            filters: [
              {
                dimension: filterDimension || "page",
                operator: filterOperator || "contains",
                expression: subdomainFilter,
              },
            ],
          },
        ],
      };
    } else if (advancedDimensionFilters) {
      // If user provided advanced filters, use those
      dimensionFilterGroups = googleSearchConsole.parseIfJsonString(advancedDimensionFilters);
    }

    let response;
    try {
      response = await googleSearchConsole.getSitePerformanceData({
        $,
        url: siteUrl,
        data: {
          ...body,
          dimensionFilterGroups,
        },
      });
    } catch (error) {
      // Identify if the error was thrown by internal validation or by the API call
      const thrower = googleSearchConsole.checkWhoThrewError(error);

      // Add more helpful error messages for common 403 errors
      if (error.response?.status === 403) {
        const message = "Access denied. If you're trying to access a subdomain, select the domain property (sc-domain:example.com) and use the subdomain filter to filter for your subdomain.";
        throw new Error(`Failed to fetch data: ${message}`);
      }

      throw new Error(`Failed to fetch data (${thrower.whoThrew} error): ${error.message}`);
    }

    const rowCount = response.rows?.length || 0;
    $.export("$summary", `Fetched ${rowCount} ${rowCount === 1
      ? "row"
      : "rows"} of data.`);
    return response;
  },
};

