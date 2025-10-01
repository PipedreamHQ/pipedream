/* eslint-disable no-unused-vars */
import common from "../common/report.mjs";

export default {
  ...common,
  key: "linkedin_ads-create-report-by-advertiser-account",
  name: "Create Report By Advertiser Account",
  description: "Sample query using analytics finder that gets analytics for a particular account for date range starting in a given year. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/ads-reporting/ads-reporting#sample-request)",
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
  },
  async run({ $ }) {
    const {
      app,
      getDateRangeParam,
      startYear,
      timeGranularity,
      adAccountId,
      getListParam,
      createReport,
    } = this;

    const response = await createReport({
      $,
      params: {
        "q": "analytics",
        "pivot": "ACCOUNT",
        "dateRange": getDateRangeParam(`${startYear}-01-01`),
        timeGranularity,
        "accounts": getListParam([
          app.getSponsoredAccountUrn(adAccountId),
        ]),
      },
    });

    $.export("$summary", "Successfully retrieved analytics");

    return response;
  },
};
