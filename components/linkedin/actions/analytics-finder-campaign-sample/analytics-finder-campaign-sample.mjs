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
    campaignId: {
      propDefinition: [
        linkedin,
        "campaignId",
      ],
    },
  },
  async run({ $ }) {
  // Note: This action is based on the LinkedIn Analytics Finder sample request.
  // As such, it uses an sponsored campaign to match results by.

    const querystring = `&pivot=CAMPAIGN&dateRange.start.day=1&dateRange.start.month=1&dateRange.start.year=${this.startYear}&timeGranularity=${this.timeGranularity}&campaigns[0]=urn:li:sponsoredCampaign:${this.campaignId}`;

    const response = await this.linkedin.queryAnalytics(querystring, {
      $,
    });

    $.export("$summary", "Successfully retrieved analytics");

    return response;
  },
};
