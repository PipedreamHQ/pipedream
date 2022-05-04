// legacy_hash_id: a_2win7Y
import { axios } from "@pipedream/platform";

export default {
  key: "linkedin-analytics-finder-campaign-sample",
  name: "Query Analytics Finder Campaign Sample",
  description: "Sample query using analytics finder that gets analytics for a particular campaign in a date range starting in a given year.",
  version: "0.2.1",
  type: "action",
  props: {
    linkedin: {
      type: "app",
      app: "linkedin",
    },
    start_year: {
      type: "string",
      description: "The inclusive start year range of analytics.\nThis action query is set to 1st January, as the day and month of the start range of the analytics.",
    },
    timeGranularity: {
      type: "string",
      description: "Time granularity of results. Valid enum values:\n\nALL - Results grouped into a single result across the entire time range of the report.\nDAILY - Results grouped by day.\nMONTHLY - Results grouped by month.\nYEARLY - Results grouped by year.",
      options: [
        "ALL",
        "DAILY",
        "MONTHLY",
        "YEARLY",
      ],
    },
    campaign_id: {
      type: "string",
      description: "Sponsored campaign id to match results by.",
    },
  },
  async run({ $ }) {
  // See the API docs here: https://docs.microsoft.com/en-us/linkedin/marketing/integrations/ads-reporting/ads-reporting#analytics-finder
  // Note: This action is based on the LinkedIn Analytics Finder sample request. As such, it uses an sponsored campaign to match results by.

    return await axios($, {
      url: `https://api.linkedin.com/v2/adAnalyticsV2?q=analytics&pivot=CAMPAIGN&dateRange.start.day=1&dateRange.start.month=1&dateRange.start.year=${this.start_year}&timeGranularity=${this.timeGranularity}&campaigns[0]=urn:li:sponsoredCampaign:${this.campaign_id}`,
      headers: {
        Authorization: `Bearer ${this.linkedin.$auth.oauth_access_token}`,
      },
    });
  },
};
