/* eslint-disable no-unused-vars */
import common from "../common/report.mjs";

export default {
  ...common,
  key: "linkedin_ads-create-report-by-campaign",
  name: "Query Analytics Finder Campaign Sample",
  description: "Sample query using analytics finder that gets analytics for a particular campaign in a date range starting in a given year. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/ads-reporting/ads-reporting#analytics-finder)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    startYear: {
      propDefinition: [
        common.props.app,
        "startYear",
      ],
    },
    timeGranularity: {
      propDefinition: [
        common.props.app,
        "timeGranularity",
      ],
    },
    adAccountId: {
      propDefinition: [
        common.props.app,
        "adAccountId",
      ],
    },
    campaignId: {
      propDefinition: [
        common.props.app,
        "campaignId",
        ({ adAccountId }) => ({
          adAccountId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      getDateRangeParam,
      startYear,
      timeGranularity,
      campaignId,
      getListParam,
      createReport,
    } = this;

    const response = await createReport({
      $,
      params: {
        "q": "analytics",
        "pivot": "CAMPAIGN",
        "dateRange": getDateRangeParam(`${startYear}-01-01`),
        timeGranularity,
        "campaigns": getListParam([
          app.getSponsoredCampaignUrn(campaignId),
        ]),
      },
    });

    $.export("$summary", "Successfully retrieved analytics");

    return response;
  },
};
