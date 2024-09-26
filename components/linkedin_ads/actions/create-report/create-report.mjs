/* eslint-disable no-unused-vars */
import common from "../common/report.mjs";

export default {
  ...common,
  key: "linkedin_ads-create-report",
  name: "Create A Report",
  description: "Queries the Analytics Finder to get analytics for the specified entity i.e company, account, campaign. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/ads-reporting/ads-reporting#analytics-finder)",
  version: "0.0.3",
  type: "action",
  props: {
    ...common.props,
    adAccountId: {
      propDefinition: [
        common.props.app,
        "adAccountId",
      ],
    },
    pivot: {
      propDefinition: [
        common.props.app,
        "pivot",
      ],
    },
    timeGranularity: {
      propDefinition: [
        common.props.app,
        "timeGranularity",
      ],
    },
    dateRangeStart: {
      type: "string",
      label: "Date Range Start",
      description: "Represents the inclusive start time range of the analytics. If unset, it indicates an open range up to the end time. Should be in the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format, e.g. 2022-12-27.",
    },
    dateRangeEnd: {
      type: "string",
      label: "Date Range End",
      description: "Represents the inclusive end time range of the analytics. Must be after start time if it's present. If unset, it indicates an open range from start time to everything after. Should be in the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format, e.g. 2022-12-27.",
      optional: true,
    },
    shares: {
      type: "string[]",
      label: "Shares",
      description: "An [Array of Share URN](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api). Required unless another facet is provided.",
      optional: true,
    },
    campaigns: {
      type: "string[]",
      label: "Campaigns",
      description: "An [Array of Sponsored Campaign URN](https://docs.microsoft.com/en-us/linkedin/shared/references/v2/ads/adcampaigns?context=linkedin/marketing/context). Required unless another facet is provided.",
      optional: true,
    },
    creatives: {
      type: "string[]",
      label: "Creatives",
      description: "An [Array of Sponsored Creative URN](https://docs.microsoft.com/en-us/linkedin/shared/references/v2/ads/adcreatives?context=linkedin/marketing/context). Required unless another facet is provided.",
      optional: true,
    },
    campaignGroups: {
      type: "string[]",
      label: "Campaign Groups",
      description: "An [Array of Campaign Group URN](https://docs.microsoft.com/en-us/linkedin/shared/references/v2/ads/adcampaigngroups?context=linkedin/marketing/context). Required unless another facet is provided.",
      optional: true,
    },
    accounts: {
      propDefinition: [
        common.props.app,
        "accounts",
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
      getListParams,
      createReport,
      adAccountId,
      pivot,
      timeGranularity,
      dateRangeStart,
      dateRangeEnd,
      ...arrayProps
    } = this;

    const response = await createReport({
      $,
      params: {
        q: "analytics",
        pivot,
        timeGranularity,
        dateRange: getDateRangeParam(dateRangeStart, dateRangeEnd),
        ...getListParams(arrayProps),
      },
    });

    $.export("$summary", `Successfully retrieved analytics information with ${response.elements.length} elements.`);

    return response.elements;
  },
};
