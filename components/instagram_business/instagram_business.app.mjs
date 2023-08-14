import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "instagram_business",
  propDefinitions: {
    page: {
      type: "string",
      label: "Page",
      description: "The identifier of a page",
      async options({ prevContext }) {
        const params = {};
        if (prevContext?.after) {
          params.after = prevContext.after;
        }
        const {
          data, paging,
        } = await this.listPages({
          params,
        });
        const options = data?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
        return {
          options,
          context: {
            after: paging?.cursors?.after,
          },
        };
      },
    },
    media: {
      type: "string",
      label: "Media",
      description: "The identifier of a media object",
      async options({
        pageId, prevContext,
      }) {
        const accountId = await this.getInstagramBusinessAccountId({
          pageId,
        });
        const params = {};
        if (prevContext?.after) {
          params.after = prevContext.after;
        }
        const {
          data, paging,
        } = await this.listMedia({
          accountId,
          params,
        });
        const options = data?.map(({ id }) => id ) || [];
        return {
          options,
          context: {
            after: paging?.cursors?.after,
          },
        };
      },
    },
    userMetrics: {
      type: "string[]",
      label: "Metrics",
      description: "A comma-separated list of [Metrics](https://developers.facebook.com/docs/instagram-api/reference/ig-user/insights#metrics-and-periods) you want returned. If requesting multiple metrics, they must all have the same compatible Period.",
      options: constants.USER_INSIGHT_METRICS,
    },
    period: {
      type: "string",
      label: "Pediod",
      description: "A Period that is compatible with the metrics you are requesting.",
      async options({ metrics }) {
        const periods = [];
        if (!metrics) {
          return periods;
        }
        const userInsightPeriods = constants.USER_INSIGHT_PERIODS;
        for (const period of Object.keys(userInsightPeriods)) {
          if (metrics.every((item) => userInsightPeriods[period].includes(item))) {
            periods.push(period);
          }
        }
        return periods;
      },
    },
    mediaMetrics: {
      type: "string[]",
      label: "Metrics",
      description: "A comma-separated list of [Metrics](https://developers.facebook.com/docs/instagram-api/reference/ig-media/insights#metrics) you want returned.",
      async options({ mediaId }) {
        const media = await this.getMediaObject({
          mediaId,
          params: {
            fields: "media_type, media_product_type",
          },
        });
        const type = media.media_product_type === "REELS" || media.media_product_type === "STORY"
          ? media.media_product_type
          : media.media_type;
        return constants.MEDIA_INSIGHT_METRICS[type];
      },
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://graph.facebook.com/v17.0";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _userId() {
      return this.$auth.oauth_uid;
    },
    async _makeRequest({
      $ = this,
      path,
      pageId,
      params,
      ...args
    }) {
      if (pageId) {
        params = {
          ...params,
          access_token: await this.getAccessToken(pageId),
        };
      }

      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        params,
        ...args,
      });
    },
    async getAccessToken(pageId) {
      const { data } = await this.listPages();
      const page = data.find(({ id }) => id == pageId);
      return page.access_token;
    },
    async getInstagramBusinessAccountId({ pageId }) {
      const { instagram_business_account: account } = await this._makeRequest({
        path: `/${pageId}`,
        params: {
          fields: "instagram_business_account",
        },
        pageId,
      });
      if (!account || !account?.id) {
        throw new ConfigurationError("Could not find Instagram Business Account ID associated with the Page. Learn how to connect your account [here](https://www.facebook.com/business/help/connect-instagram-to-page).");
      }
      return account.id;
    },
    getMediaObject({
      mediaId, ...args
    }) {
      return this._makeRequest({
        path: `/${mediaId}`,
        ...args,
      });
    },
    getUserInsights({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/${accountId}/insights`,
        ...args,
      });
    },
    getMediaInsights({
      mediaId, ...args
    }) {
      return this._makeRequest({
        path: `/${mediaId}/insights`,
        ...args,
      });
    },
    listPages(args = {}) {
      return this._makeRequest({
        path: `/${this._userId()}/accounts`,
        ...args,
      });
    },
    listMedia({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/${accountId}/media`,
        ...args,
      });
    },
    listMediaComments({
      mediaId, ...args
    }) {
      return this._makeRequest({
        path: `/${mediaId}/comments`,
        ...args,
      });
    },
    createMediaComment({
      mediaId, ...args
    }) {
      return this._makeRequest({
        path: `/${mediaId}/comments`,
        method: "POST",
        ...args,
      });
    },
    createContainer({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/${accountId}/media`,
        method: "POST",
        ...args,
      });
    },
    publishContainer({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/${accountId}/media_publish`,
        method: "POST",
        ...args,
      });
    },
  },
};
