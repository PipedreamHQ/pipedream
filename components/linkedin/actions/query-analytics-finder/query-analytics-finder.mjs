// legacy_hash_id: a_8Ki7e2
import { axios } from "@pipedream/platform";

export default {
  key: "linkedin-query-analytics-finder",
  name: "Query Analytics Finder",
  description: "Queries the Analytics Finder to get analytics for the specified entity i.e company, account, campaign.",
  version: "0.1.1",
  type: "action",
  props: {
    linkedin: {
      type: "app",
      app: "linkedin",
    },
    dateRange_start_day: {
      type: "string",
      description: "Represents the inclusive start time range, day component, of the analytics. If unset, it indicates an open range up to the end time. The day is represented in integer. Valid range from 1 to 31 depending on month.",
      optional: true,
    },
    dateRange_start_month: {
      type: "string",
      description: "Represents the inclusive start time range, month component, of the analytics. If unset, it indicates an open range up to the end time. The month is represented in integer. Valid range from 1 to 12.",
      optional: true,
    },
    dateRange_start_year: {
      type: "string",
      description: "Represents the inclusive start time range, year component, of the analytics. If unset, it indicates an open range up to the end time. The year is represented in integer.",
      optional: true,
    },
    dateRange_end_day: {
      type: "string",
      description: "Represents the inclusive end time range, day component, of the analytics. Must be after start time if it's present. If unset, it indicates an open range from start time to everything after. The day is represented in integer. Valid range from 1 to 31 depending on month.",
      optional: true,
    },
    dateRange_end_month: {
      type: "string",
      description: "Represents the inclusive end time range, month component, of the analytics. Must be after start time if it's present. If unset, it indicates an open range from start time to everything after. The month is represented in integer. Valid range from 1 to 12.",
      optional: true,
    },
    dateRange_end_year: {
      type: "string",
      description: "Represents the inclusive end time range, year component, of the analytics. Must be after start time if it's present. If unset, it indicates an open range from start time to everything after. The year is represented in integer.",
      optional: true,
    },
    campaignType: {
      type: "any",
      description: "An [Array of Campaign Type Values](https://docs.microsoft.com/en-us/linkedin/shared/references/v2/ads/adaccounts?context=linkedin/marketing/context). Required unless another facet is provided. Supported types are [TEXT_AD, SPONSORED_UPDATES, SPONSORED_INMAILS, DYNAMIC]. Requires at least one other facet.",
      optional: true,
    },
    shares: {
      type: "any",
      description: "An [Array of Share URN](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api). Required unless another facet is provided.",
      optional: true,
    },
    campaigns: {
      type: "any",
      description: "An [Array of Sponsored Campaign URN](https://docs.microsoft.com/en-us/linkedin/shared/references/v2/ads/adcampaigns?context=linkedin/marketing/context). Required unless another facet is provided.",
      optional: true,
    },
    creatives: {
      type: "any",
      description: "An [Array of Sponsored Creative URN](https://docs.microsoft.com/en-us/linkedin/shared/references/v2/ads/adcreatives?context=linkedin/marketing/context). Required unless another facet is provided.",
      optional: true,
    },
    campaignGroups: {
      type: "any",
      description: "An [Array of Campaign Group URN](https://docs.microsoft.com/en-us/linkedin/shared/references/v2/ads/adcampaigngroups?context=linkedin/marketing/context). Required unless another facet is provided.",
      optional: true,
    },
    accounts: {
      type: "any",
      description: "An [Array of Account URN](https://docs.microsoft.com/en-us/linkedin/shared/references/v2/ads/adaccounts?context=linkedin/marketing/context). Required unless another facet is provided.",
      optional: true,
    },
    companies: {
      type: "any",
      description: "An [Array of Organization URN](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/organizations/organization-lookup-api). Required unless another facet is provided.",
      optional: true,
    },
    pivot: {
      type: "string",
      description: "Pivot of results, by which each report data point is grouped. The following enum values are supported:\n* COMPANY - Group results by advertiser's company.\n* ACCOUNT - Group results by account.\n* SHARE - Group results by sponsored share.\n* CAMPAIGN - Group results by campaign.\n* CREATIVE - Group results by creative.\n* CAMPAIGN_GROUP - Group results by campaign group.\n* CONVERSION - Group results by conversion.\n* CONVERSATION_NODE - The element row in the conversation will be the information for each individual node of the conversation tree.\n* CONVERSATION_NODE_OPTION_INDEX - Used `actionClicks` are deaggregated and reported at the Node Button level. The second value of the `pivot_values` will be the index of the button in the node.\n* SERVING_LOCATION - Group results by serving location, onsite or offsite.\n* CARD_INDEX - Group results by the index of where a card appears in a carousel ad creative. Metrics are based on the index of the card at the time when the user's action (impression, click, etc.) happened on the creative (Carousel creatives only).\n* MEMBER_COMPANY_SIZE - Group results by member company size.\n* MEMBER_INDUSTRY - Group results by member industry.\n* MEMBER_SENIORITY - Group results by member seniority.\n* MEMBER_JOB_TITLE - Group results by member job title.\n* MEMBER_JOB_FUNCTION - Group results by member job function.\n* MEMBER_COUNTRY_V2 - Group results by member country.\n* MEMBER_REGION_V2 - Group results by member region.\n* MEMBER_COMPANY - Group results by member company.",
      options: [
        "COMPANY",
        "ACCOUNT",
        "SHARE",
        "CAMPAIGN",
        "CREATIVE",
        "CAMPAIGN_GROUP",
        "CONVERSION",
        "CONVERSATION_NODE",
        "CONVERSATION_NODE_OPTION_INDEX",
        "SERVING_LOCATION",
        "CARD_INDEX",
        "MEMBER_COMPANY_SIZE",
        "MEMBER_INDUSTRY",
        "MEMBER_SENIORITY",
        "MEMBER_JOB_TITLE",
        "MEMBER_JOB_FUNCTION",
        "MEMBER_COUNTRY_V2",
        "MEMBER_REGION_V2",
        "MEMBER_COMPANY",
      ],
    },
    timeGranularity: {
      type: "string",
      description: "Time granularity of results. Valid enum values:\n* ALL - Results grouped into a single result across the entire time range of the report.\n* DAILY - Results grouped by day.\n* MONTHLY - Results grouped by month.\n* YEARLY - Results grouped by year.",
      options: [
        "ALL",
        "DAILY",
        "MONTHLY",
        "YEARLY",
      ],
    },
    projection: {
      type: "string",
      description: "Decoration statement used to fetch data belonging to URN objects within the Analytics Finder, without having to make an extra call to that object's API. \nDecoration is a mechanism in LinkedIn's APIs to fetch data belonging to a URN object without having to make an extra call to that object's API. See [Response Decoration.](https://docs.microsoft.com/en-us/linkedin/shared/api-guide/concepts/decoration)",
      optional: true,
    },
    fields: {
      type: "string",
      description: "Specifies the fields. limited set of metrics to retrieve. Available fields: externalWebsiteConversions, dateRange, impressions, landingPageClicks, likes, shares, costInLocalCurrency, pivot, pivotValue.",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs here: https://docs.microsoft.com/en-us/linkedin/marketing/integrations/ads-reporting/ads-reporting#analytics-finder

    //This is a helper function that will generate the query string for parameter expecting URN valued arrays.
    var generateQueryStringForParameter = function(querystring_name, parameter_values_array) {
      const querystringArr = parameter_values_array;
      var querystringArrParameter = "";
      var i = 0;
      if (querystringArr && querystringArr.length > 0) {
        querystringArr.forEach((querystring_arr_item) =>  {
          if (i == 0) {
            querystringArrParameter = `&${querystring_name}[${i}]=${querystring_arr_item}&`;
          } else {
            querystringArrParameter += `${querystring_name}[${i}]=${querystring_arr_item}&`;
          }
          i++;
        });
        querystringArrParameter = querystringArrParameter.substring(0, querystringArrParameter.length - 1);
      }
      return querystringArrParameter;
    };

    //Populates the dateRange.end and dataRange.start parameters to the Analytics Finder request.
    var dateRange = {
      start: {
        day: this.dateRange_start_day,
        month: this.dateRange_start_month,
        year: this.dateRange_start_year,
      },
      end: {
        day: this.dateRange_end_day,
        month: this.dateRange_end_month,
        year: this.dateRange_end_year,
      },
    };

    var dateRangeQueryString = "";
    if (dateRange.start.year) {
      dateRangeQueryString += `&dateRange.start.year=${dateRange.start.year}`;
    }

    if (dateRange.start.month) {
      dateRangeQueryString += `&dateRange.start.month=${dateRange.start.month}`;
    }

    if (dateRange.start.day) {
      dateRangeQueryString += `&dateRange.start.day=${dateRange.start.day}`;
    }

    if (dateRange.end.year) {
      dateRangeQueryString += `&dateRange.end.year=${dateRange.end.year}`;
    }

    if (dateRange.end.month) {
      dateRangeQueryString += `&dateRange.end.month=${dateRange.end.month}`;
    }

    if (dateRange.end.day) {
      dateRangeQueryString += `&dateRange.end.day=${dateRange.end.day}`;
    }

    //Generates URN based arrays using helper function
    const campaignTypeQsparam = generateQueryStringForParameter("campaignType", this.campaignType);
    const sharesQsparam = generateQueryStringForParameter("shares", this.shares);
    const campaignsQsparam = generateQueryStringForParameter("campaigns", this.campaigns);
    const creativesQsparam = generateQueryStringForParameter("creatives", this.creatives);
    const campaignGroupsQsparam = generateQueryStringForParameter("campaignGroups", this.campaignGroups);
    const accountsQsparam = generateQueryStringForParameter("accounts", this.accounts);
    const companiesQsparam = generateQueryStringForParameter("companies", this.companies);

    return await axios($, {
      url: `https://api.linkedin.com/v2/adAnalyticsV2?q=analytics${dateRangeQueryString}${campaignTypeQsparam}${sharesQsparam}${sharesQsparam}${campaignsQsparam}${creativesQsparam}${accountsQsparam}${campaignGroupsQsparam}${companiesQsparam}`,
      headers: {
        Authorization: `Bearer ${this.linkedin.$auth.oauth_access_token}`,
      },
      params: {
        pivot: this.pivot,
        timeGranularity: this.timeGranularity,
        projection: this.projection,
        fields: this.fields,
      },
    });
  },
};
