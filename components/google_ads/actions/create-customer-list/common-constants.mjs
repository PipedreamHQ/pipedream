import countryCodeOptions from "./common-country-code-options.mjs";

export const USER_LIST_TYPES = {
  CRM_BASED: "crmBasedUserList",
  RULE_BASED: "ruleBasedUserList",
  LOGICAL: "logicalUserList",
  BASIC: "basicUserList",
  LOOKALIKE: "lookalikeUserList",
};

const USER_LIST_CRM_BASED_PROPS = {
  uploadKeyType: {
    type: "string",
    label: "Upload Key Type",
    description:
      "Matching key type of the list. Mixed data types are not allowed on the same list.",
    options: [
      {
        label:
          "Members are matched from customer info such as email address, phone number or physical address.",
        value: "CONTACT_INFO",
      },
      {
        label:
          "Members are matched from a user id generated and assigned by the advertiser.",
        value: "CRM_ID",
      },
      {
        label: "Members are matched from mobile advertising IDs.",
        value: "MOBILE_ADVERTISING_ID",
      },
    ],
  },
  dataSourceType: {
    type: "string",
    label: "Data Source Type",
    description:
      "Data source of the list. Only customers on the allow-list can create third-party sourced CRM lists.",
    optional: true,
    default: "FIRST_PARTY",
    options: [
      {
        label: "The uploaded data is first-party data.",
        value: "FIRST_PARTY",
      },
      {
        label: "The uploaded data is from a third-party credit bureau,",
        value: "THIRD_PARTY_CREDIT_BUREAU",
      },
      {
        label: "The uploaded data is from a third-party voter file.",
        value: "THIRD_PARTY_VOTER_FILE",
      },
    ],
  },
  appId: {
    type: "string",
    label: "App ID",
    description:
      "A string that uniquely identifies a mobile application from which the data was collected. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v21/CrmBasedUserListInfo) for more details.",
    optional: true,
  },
};

const USER_LIST_RULE_BASED_PROPS = {
  prepopulationStatus: {
    type: "boolean",
    label: "Request Prepopulation",
    description:
      "If true, past site visitors or app users who match the list definition will be included in the list. This will only add past users from within the last 30 days, depending on the list's membership duration and the date when the remarketing tag is added.",
    optional: true,
  },
  flexibleRuleUserList: {
    type: "object",
    label: "Flexible Rule Customer List",
    description:
      "Flexible rule representation of visitors with one or multiple actions. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v21/FlexibleRuleUserListInfo) on how to build this object. Values will be parsed as JSON where applicable.",
    optional: true,
  },
};

const USER_LIST_LOGICAL_PROPS = {
  rules: {
    type: "string[]",
    label: "Rules",
    description:
      "Logical list rules that define this customer list. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v21/UserListLogicalRuleInfo) on how to build each object. Values will be parsed as JSON where applicable.",
  },
};

const USER_LIST_BASIC_PROPS = {
  conversionActions: {
    type: "string[]",
    label: "Conversion action(s)",
    description: "One or more [conversion actions](https://developers.google.com/google-ads/api/reference/rpc/v21/ConversionAction) to build the list with.",
    optional: true,
    options: async() => {
      const {
        accountId, customerClientId,
      } = this;
      const response = await this.googleAds.listConversionActions({
        accountId,
        customerClientId,
      });
      return response?.map(({
        conversionAction: {
          resourceName, name,
        },
      }) => ({
        label: name,
        value: resourceName,
      }));
    },
  },
  remarketingActions: {
    type: "string[]",
    label: "Remarketing action(s)",
    description: "One or more [remarketing actions](https://developers.google.com/google-ads/api/reference/rpc/v21/RemarketingAction).",
    optional: true,
    options: async() => {
      const {
        accountId, customerClientId,
      } = this;
      const response = await this.googleAds.listRemarketingActions({
        accountId,
        customerClientId,
      });
      return response?.map(({
        remarketingAction: {
          resourceName, name,
        },
      }) => ({
        label: name,
        value: resourceName,
      }));
    },
  },
};

const USER_LIST_LOOKALIKE_PROPS = {
  seedUserListIds: {
    type: "string[]",
    label: "Seed User List(s)",
    description: "One or more customer lists from which this list is derived.",
    options: async() => {
      const {
        accountId, customerClientId,
      } = this;
      const response = await this.googleAds.listUserLists({
        accountId,
        customerClientId,
      });
      return response?.map(({
        userList: {
          id, name,
        },
      }) => ({
        label: name,
        value: id,
      }));
    },
  },
  expansionLevel: {
    type: "string",
    label: "Expansion Level",
    description:
      "Expansion level, reflecting the size of the lookalike audience",
    optional: true,
    options: [
      {
        label:
          "Expansion to a small set of users that are similar to the seed lists",
        value: "NARROW",
      },
      {
        label:
          "Expansion to a medium set of users that are similar to the seed lists. Includes all users of NARROW, and more.",
        value: "BALANCED",
      },
      {
        label:
          "Expansion to a large set of users that are similar to the seed lists. Includes all users of BALANCED, and more.",
        value: "BROAD",
      },
    ],
  },
  countryCodes: {
    type: "string[]",
    label: "Country Codes",
    description: "Countries targeted by the Lookalike.",
    optional: true,
    options: countryCodeOptions,
  },
};

export const USER_LIST_TYPE_OPTIONS = [
  {
    label: "CRM-based - a list of provided customers",
    value: USER_LIST_TYPES.CRM_BASED,
    docsLink:
      "https://developers.google.com/google-ads/api/reference/rpc/v21/CrmBasedUserListInfo",
    props: USER_LIST_CRM_BASED_PROPS,
  },
  {
    label: "Rule-Based - a customer list generated by a rule",
    value: USER_LIST_TYPES.RULE_BASED,
    docsLink:
      "https://developers.google.com/google-ads/api/reference/rpc/v21/RuleBasedUserListInfo",
    props: USER_LIST_RULE_BASED_PROPS,
  },
  {
    label: "Logical - a custom combination of customer lists",
    value: USER_LIST_TYPES.LOGICAL,
    docsLink:
      "https://developers.google.com/google-ads/api/reference/rpc/v21/LogicalUserListInfo",
    props: USER_LIST_LOGICAL_PROPS,
  },
  {
    label:
      "Basic - a customer list targeting as a collection of conversions or remarketing actions",
    value: USER_LIST_TYPES.BASIC,
    docsLink:
      "https://developers.google.com/google-ads/api/reference/rpc/v21/BasicUserListInfo",
    props: USER_LIST_BASIC_PROPS,
  },
  {
    label:
      "Lookalike - a list composed of customers similar to those of a configurable seed",
    value: USER_LIST_TYPES.LOOKALIKE,
    docsLink:
      "https://developers.google.com/google-ads/api/reference/rpc/v21/LookalikeUserListInfo",
    props: USER_LIST_LOOKALIKE_PROPS,
  },
];
