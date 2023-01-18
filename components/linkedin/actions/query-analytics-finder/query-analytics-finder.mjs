import linkedin from "../../linkedin.app.mjs";

const FACETS = [
  "campaignType",
  "shares",
  "campaigns",
  "creatives",
  "campaignGroups",
  "accounts",
  "companies",
];

export default {
  key: "linkedin-query-analytics-finder",
  name: "Query Analytics Finder",
  description: "Queries the Analytics Finder to get analytics for the specified entity i.e company, account, campaign. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/ads-reporting/ads-reporting#analytics-finder)",
  version: "0.1.4",
  type: "action",
  props: {
    linkedin,
    pivot: {
      propDefinition: [
        linkedin,
        "pivot",
      ],
    },
    timeGranularity: {
      propDefinition: [
        linkedin,
        "timeGranularity",
      ],
    },
    dateRangeStart: {
      type: "string",
      label: "Date Range Start",
      description: "Represents the inclusive start time range of the analytics. If unset, it indicates an open range up to the end time.",
    },
    dateRangeEnd: {
      type: "string",
      label: "Date Range End",
      description: "Represents the inclusive end time range of the analytics. Must be after start time if it's present. If unset, it indicates an open range from start time to everything after.",
      optional: true,
    },
    campaignType: {
      type: "string[]",
      label: "Campaign Type",
      description: "An [Array of Campaign Type Values](https://docs.microsoft.com/en-us/linkedin/shared/references/v2/ads/adaccounts?context=linkedin/marketing/context). Required unless another facet is provided. Supported types are [TEXT_AD, SPONSORED_UPDATES, SPONSORED_INMAILS, DYNAMIC]. Requires at least one other facet.",
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
      type: "string[]",
      label: "Accounts",
      description: "An [Array of Account URN](https://docs.microsoft.com/en-us/linkedin/shared/references/v2/ads/adaccounts?context=linkedin/marketing/context). Required unless another facet is provided.",
      optional: true,
    },
    companies: {
      type: "string[]",
      label: "Companies",
      description: "An [Array of Organization URN](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/organizations/organization-lookup-api). Required unless another facet is provided.",
      optional: true,
    },
  },
  methods: {
    createDateRangeQuery() {
      function makeQuery(date, startOrEnd) {
        return `dateRange=(${startOrEnd}:(day:${date.getDate() + 1},month:${date.getMonth() + 1},year:${date.getFullYear()}))`;
      }
      let query = "";
      query += makeQuery(new Date(this.dateRangeStart), "start");
      if (this.dateRangeEnd) {
        query += `&${this.makeQuery(new Date(this.dateRangeEnd), "end")}`;
      }
      return query;
    },
    createListQuery(name, value) {
      return `${name}=List(${value.join(",")})`;
    },
  },
  async run({ $ }) {
    let query = `&pivot=${this.pivot}&timeGranularity=${this.timeGranularity}&${this.createDateRangeQuery()}`;

    for (const facet of FACETS) {
      if (this[facet]) {
        query += `&${this.createListQuery(facet, this[facet])}`;
      }
    }

    const response = await this.linkedin.queryAnaltyics(query, {
      $,
    });

    $.export("$summary", "Successfully retrieved analytics information");

    return response;
  },
};
