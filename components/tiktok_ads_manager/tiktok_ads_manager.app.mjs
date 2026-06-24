import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tiktok_ads_manager",
  propDefinitions: {
    advertiserId: {
      type: "string",
      label: "Advertiser ID",
      description: "Your TikTok Ads Manager advertiser ID. Find it in the Ads Manager URL after `aadvid=` (e.g., `aadvid=7123456789012345678`). Also visible under Account Info in Business Center.",
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number for paginated results. Starts at 1.",
      optional: true,
      default: 1,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Number of results per page (default: 20, max: 1000).",
      optional: true,
      default: 20,
    },
    operationStatus: {
      type: "string",
      label: "Status",
      description: "Operational status. `ENABLE` = active, `DISABLE` = paused.",
      optional: true,
      options: [
        "ENABLE",
        "DISABLE",
      ],
    },
    primaryStatus: {
      type: "string",
      label: "Filter by Status",
      description: "Filter results by primary status. Leave blank for all statuses.",
      optional: true,
      options: [
        "STATUS_ALL",
        "STATUS_ACTIVE",
        "STATUS_NOT_ACTIVE",
        "STATUS_DELETED",
        "STATUS_CAMPAIGN_DELETE",
      ],
    },
    budgetMode: {
      type: "string",
      label: "Budget Mode",
      description: "`BUDGET_MODE_DAY` for a daily cap; `BUDGET_MODE_TOTAL` for a lifetime total; `BUDGET_MODE_DYNAMIC_DAILY_BUDGET` for an average daily budget over a week (ad groups only).",
      options: [
        "BUDGET_MODE_DAY",
        "BUDGET_MODE_TOTAL",
        "BUDGET_MODE_DYNAMIC_DAILY_BUDGET",
        "BUDGET_MODE_INFINITE",
      ],
    },
    budget: {
      type: "string",
      label: "Budget",
      description: "Budget amount in the account's currency. Example: `50.00` for $50 USD.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://business-api.tiktok.com/open_api/v1.3";
    },
    _headers() {
      return {
        "Access-Token": this.$auth.oauth_access_token,
      };
    },
    async _makeRequest({
      $ = this, method = "GET", path, params, data, headers = {},
    }) {
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Content-Type": "application/json",
          ...this._headers(),
          ...headers,
        },
        params,
        data,
      });
    },
    getAdvertiserInfo({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "/advertiser/info/",
        params,
      });
    },
    listCampaigns({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "/campaign/get/",
        params,
      });
    },
    createCampaign({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/campaign/create/",
        data,
      });
    },
    updateCampaign({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/campaign/update/",
        data,
      });
    },
    listAdGroups({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "/adgroup/get/",
        params,
      });
    },
    createAdGroup({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/adgroup/create/",
        data,
      });
    },
    updateAdGroup({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/adgroup/update/",
        data,
      });
    },
    listAds({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "/ad/get/",
        params,
      });
    },
    createAd({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/ad/create/",
        data,
      });
    },
    updateAd({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/ad/update/",
        data,
      });
    },
    uploadImage({
      $, data, headers,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/file/image/ad/upload/",
        data,
        headers,
      });
    },
    uploadVideo({
      $, data, headers,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/file/video/ad/upload/",
        data,
        headers,
      });
    },
    getReport({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "/report/integrated/get/",
        params,
      });
    },
    listAudiences({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "/dmp/custom_audience/list/",
        params,
      });
    },
    uploadAudienceFile({
      $, data, headers,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/dmp/custom_audience/file/upload/",
        data,
        headers,
      });
    },
    createCustomAudience({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/dmp/custom_audience/create/",
        data,
      });
    },
    updateCustomAudience({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/dmp/custom_audience/update/",
        data,
      });
    },
    createLookalikeAudience({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/dmp/custom_audience/lookalike/create/",
        data,
      });
    },
    sendConversionEvent({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/pixel/batch/",
        data,
      });
    },
    getSparkAdVideoInfo({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "/identity/video/info/",
        params,
      });
    },
  },
};
