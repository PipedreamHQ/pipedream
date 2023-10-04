/* eslint-disable no-unused-vars */
import common from "../common/report.mjs";

export default {
  ...common,
  key: "linkedin_ads-create-report-by-advertiser-account",
  name: "Create Report By Advertiser Account",
  description: "Sample query using analytics finder that gets analytics for a particular account for date range starting in a given year. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/ads-reporting/ads-reporting#sample-request)",
  version: "0.0.1",
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
    account: {
      type: "string",
      label: "Account",
      description: "An [Account URN](https://docs.microsoft.com/en-us/linkedin/shared/references/v2/ads/adaccounts?context=linkedin/marketing/context).",
      optional: false,
      propDefinition: [
        common.props.app,
        "accounts",
      ],
    },
  },
  async run({ $ }) {
    const {
      startYear,
      timeGranularity,
      account,
      getListParam,
      createReport,
    } = this;

    const response = await createReport({
      $,
      params: {
        "pivot": "ACCOUNT",
        "dateRange.start.day": 1,
        "dateRange.start.month": 1,
        "dateRange.start.year": startYear,
        timeGranularity,
        "accounts": getListParam([
          account,
        ]),
      },
    });

    $.export("$summary", "Successfully retrieved analytics");

    return response;
  },
};
