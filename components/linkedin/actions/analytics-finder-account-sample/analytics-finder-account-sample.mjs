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
      propDefinition: [
        linkedin,
        "startYear",
      ],
    },
    timeGranularity: {
      propDefinition: [
        linkedin,
        "timeGranularity",
      ],
    },
    adAccountId: {
      propDefinition: [
        linkedin,
        "adAccountId",
      ],
    },
  },
  async run({ $ }) {
  // Note: This action is based on the LinkedIn Analytics Finder sample request.
  // It was modified to use an sponsored account to match results by.

    const querystring = `&pivot=ACCOUNT&dateRange.start.day=1&dateRange.start.month=1&dateRange.start.year=${this.startYear}&timeGranularity=${this.timeGranularity}&accounts[0]=urn:li:sponsoredAccount:${this.adAccountId}`;

    const response = await this.linkedin.queryAnalytics(querystring, {
      $,
    });

    $.export("$summary", "Successfully retrieved analytics");

    return response;
  },
};
