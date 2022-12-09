import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-analytics-finder-campaign-sample",
  name: "Query Analytics Finder Campaign Sample",
  description: "Sample query using analytics finder that gets analytics for a particular campaign in a date range starting in a given year. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/ads-reporting/ads-reporting#analytics-finder)",
  version: "0.2.2",
  type: "action",
  props: {
    linkedin,
    startYear: {
      type: "string",
      label: "Start Year",
      description: "The inclusive start year range of analytics.\nThis action query is set to 1st January, as the day and month of the start range of the analytics.",
    },
    timeGranularity: {
      type: "string",
      label: "Time Granularity",
      description: "Time granularity of results. Valid enum values:\n\nALL - Results grouped into a single result across the entire time range of the report.\nDAILY - Results grouped by day.\nMONTHLY - Results grouped by month.\nYEARLY - Results grouped by year.",
      options: [
        "ALL",
        "DAILY",
        "MONTHLY",
        "YEARLY",
      ],
    },
    campaignId: {
      type: "string",
      label: "Campaign Id",
      description: "Sponsored campaign id to match results by.",
    },
  },
  async run({ $ }) {
  // Note: This action is based on the LinkedIn Analytics Finder sample request.
  // As such, it uses an sponsored campaign to match results by.

    const response = await this.linkedin.getCampaignAnalyticsSample({
      $,
      startYear: this.startYear,
      timeGranularity: this.timeGranularity,
      adAccountId: this.adAccountId,
    });

    $.export("$summary", "Successfully retrieved analytics");

    return response;
  },
};
