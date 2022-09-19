// legacy_hash_id: a_rJipgn
import { axios } from "@pipedream/platform";

export default {
  key: "linkedin-analytics-finder-account-sample",
  name: "Query Analytics Finder Account Sample",
  description: "Sample query using analytics finder that gets analytics for a particular account for date range starting in a given year.",
  version: "0.1.1",
  type: "action",
  props: {
    linkedin: {
      type: "app",
      app: "linkedin",
    },
    start_year: {
      type: "string",
      description: "The inclusive start year range of the analytics.\nThis action query is set to 1st January, as day and month of the start range of the analytics.",
    },
    timeGranularity: {
      type: "string",
      description: "Time granularity of results. Valid enum values:\n\n* ALL - Results grouped into a single result across the entire time range of the report.\n* DAILY - Results grouped by day.\n* MONTHLY - Results grouped by month.\n* YEARLY - Results grouped by year.",
      options: [
        "ALL",
        "DAILY",
        "MONTHLY",
        "YEARLY",
      ],
    },
    ad_account_id: {
      type: "string",
      description: "Sponsored ad account id match results by.",
    },
  },
  async run({ $ }) {
  //See the API docs here: https://docs.microsoft.com/en-us/linkedin/marketing/integrations/ads-reporting/ads-reporting#sample-request
  //Note: This action is based on the LinkedIn Analytics Finder sample request. It was modified to use an sponsored account to match results by.

    return await axios($, {
      url: `https://api.linkedin.com/v2/adAnalyticsV2?q=analytics&pivot=ACCOUNT&dateRange.start.day=1&dateRange.start.month=1&dateRange.start.year=${this.start_year}&timeGranularity=${this.timeGranularity}&accounts[0]=urn:li:sponsoredAccount:${this.ad_account_id}`,
      headers: {
        Authorization: `Bearer ${this.linkedin.$auth.oauth_access_token}`,
      },
    });
  },
};
