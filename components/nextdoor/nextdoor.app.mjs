import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "nextdoor",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "A name for the resource being created (e.g., campaign name, advertiser name).",
    },
    websiteUrl: {
      type: "string",
      label: "Website URL",
      description: "The website URL for the advertiser.",
      optional: true,
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "The category ID for the advertiser.",
      optional: true,
      async options() {
        const { categories } = await this.listAdvertiserCategories();
        return categories.map(({
          id: value,
          name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    advertiserId: {
      type: "string",
      label: "Advertiser ID",
      description: "The ID of the advertiser.",
      async options() {
        const { user: { advertisers_with_access: advertisers } } = await this.me();
        return advertisers.map(({ id }) => id);
      },
    },
    objective: {
      type: "string",
      label: "Objective",
      description: "The objective of the campaign.",
      options: [
        "AWARENESS",
        "CONSIDERATION",
      ],
    },
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The ID of the campaign.",
      async options({
        advertiserId,
        prevContext: { cursor },
      }) {
        if (cursor === null) {
          return [];
        }
        const {
          campaigns,
          page_info: { end_cursor: nextCursor },
        } = await this.listAdvertiserCampaigns({
          data: {
            advertiser_id: advertiserId,
            pagination_parameters: {
              page_size: constants.DEFAULT_LIMIT,
              cursor,
            },
          },
        });
        const options = campaigns.map(({
          data: {
            id: value,
            name: label,
          },
        }) => ({
          label,
          value,
        }));

        return {
          options,
          context: {
            cursor: nextCursor || null,
          },
        };
      },
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The start time in **ZonedDateTime** format. *This date time should be in the future*. Eg. `2023-08-03T10:15:30-07:00[America/Los_Angeles]`. [See the documentation](https://developer.nextdoor.com/reference/advertising-data-types).",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "The end time in **ZonedDateTime** format. If the **End Time** is not passed in, then the AdGroup is assumed to be running continuously. Eg. `2023-08-03T10:15:30-07:00[America/Los_Angeles]`. [See the documentation](https://developer.nextdoor.com/reference/advertising-data-types).",
      optional: true,
    },
    adGroupId: {
      type: "string",
      label: "Ad Group ID",
      description: "The ID of the ad group.",
      async options({
        advertiserId,
        campaignId,
        prevContext: { cursor },
      }) {
        if (cursor === null) {
          return [];
        }
        const {
          adgroups,
          page_info: { end_cursor: nextCursor },
        } = await this.listAdGroups({
          data: {
            advertiser_id: advertiserId,
            campaign_id: campaignId,
            pagination_parameters: {
              page_size: constants.DEFAULT_LIMIT,
              cursor,
            },
          },
        });
        const options = adgroups.map(({
          data: {
            id: value,
            name: label,
          },
        }) => ({
          label,
          value,
        }));

        return {
          options,
          context: {
            cursor: nextCursor || null,
          },
        };
      },
    },
    creativeId: {
      type: "string",
      label: "Creative ID",
      description: "The ID of the creative.",
      async options({
        advertiserId,
        prevContext: { cursor },
      }) {
        if (cursor === null) {
          return [];
        }
        const {
          creatives,
          page_info: { end_cursor: nextCursor },
        } = await this.listAdvertiserCreatives({
          data: {
            advertiser_id: advertiserId,
            pagination_parameters: {
              page_size: constants.DEFAULT_LIMIT,
              cursor,
            },
          },
        });
        const options = creatives.map(({
          data: {
            id: value,
            name: label,
          },
        }) => ({
          label,
          value,
        }));

        return {
          options,
          context: {
            cursor: nextCursor || null,
          },
        };
      },
    },
    schedule: {
      type: "string",
      label: "Schedule",
      description: "The schedule for the report.",
      options: [
        "DAILY",
        "WEEKLY",
        "MONTHLY",
        "QUARTERLY",
      ],
    },
    recipientEmails: {
      type: "string[]",
      label: "Recipient Emails",
      description: "An array of recipient email addresses.",
    },
    dimensionGranularity: {
      type: "string[]",
      label: "Dimension Granularity",
      description: "The level of detail for the report.",
      options: [
        "CAMPAIGN",
        "AD_GROUP",
        "AD",
        "PLACEMENT",
      ],
    },
    timeGranularity: {
      type: "string",
      label: "Time Granularity",
      description: "The aggregation level for time in the report.",
      options: [
        "DAY",
        "WEEK",
        "MONTH",
      ],
    },
    metrics: {
      type: "string[]",
      label: "Metrics",
      description: "The metrics to include in the report.",
      options: [
        "CLICKS",
        "IMPRESSIONS",
        "CTR",
        "CONVERSIONS",
        "SPEND",
        "CPM",
        "CPC",
        "BILLABLE_SPEND",
      ],
    },
  },
  methods: {
    getUrl(path) {
      return `https://ads.nextdoor.com/v2/api${path}`;
    },
    getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.authorization_token}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    me(args = {}) {
      return this._makeRequest({
        path: "/me",
        ...args,
      });
    },
    listAdvertiserCategories(args = {}) {
      return this._makeRequest({
        path: "/advertiser/categories/list",
        ...args,
      });
    },
    listAdvertiserCampaigns(args = {}) {
      return this._makeRequest({
        path: "/advertiser/campaign/list",
        ...args,
      });
    },
    listAdGroups(args = {}) {
      return this._makeRequest({
        path: "/adgroup/list",
        ...args,
      });
    },
    listAdvertiserCreatives(args = {}) {
      return this._makeRequest({
        path: "/advertiser/creative/list",
        ...args,
      });
    },
  },
};
