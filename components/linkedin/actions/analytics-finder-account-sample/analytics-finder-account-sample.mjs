import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-analytics-finder-account-sample",
  name: "Query Analytics Finder Account Sample",
  description: "Sample query using analytics finder that gets analytics for a particular account for date range starting in a given year. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/ads-reporting/ads-reporting#sample-request)",
  version: "0.1.2",
  type: "action",
  props: {
    linkedin,
    startYear: {
      type: "string",
      label: "Start Year",
      description: "The inclusive start year range of the analytics.\nThis action query is set to 1st January, as day and month of the start range of the analytics.",
    },
    timeGranularity: {
      type: "string",
      label: "Time Granularity",
      description: "Time granularity of results. Valid enum values:\n\n* ALL - Results grouped into a single result across the entire time range of the report.\n* DAILY - Results grouped by day.\n* MONTHLY - Results grouped by month.\n* YEARLY - Results grouped by year.",
      options: [
        "ALL",
        "DAILY",
        "MONTHLY",
        "YEARLY",
      ],
    },
    adAccountId: {
      type: "string",
      label: "Ad Account Id",
      description: "Sponsored ad account id match results by.",
    },
  },
  async run({ $ }) {
  // Note: This action is based on the LinkedIn Analytics Finder sample request.
  // It was modified to use an sponsored account to match results by.

    const response = await this.linkedin.getAccountAnalyticsSample({
      $,
      startYear: this.startYear,
      timeGranularity: this.timeGranularity,
      adAccountId: this.adAccountId,
    });

    $.export("$summary", "Successfully retrieved analytics");

    return response;
  },
};
