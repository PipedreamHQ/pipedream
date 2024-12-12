import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "sailpoint",
  propDefinitions: {
    requestedFor: {
      type: "string[]",
      label: "Requested For",
      description: "List of Identity IDs for whom the Access is requested.",
      async options({ page }) {
        const data = await this.listIdentityIds({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    sourceId: {
      type: "string",
      label: "Source ID",
      description: "ID of the source to upload the account file.",
      async options({ page }) {
        const data = await this.listSoruceIds({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://sailpoint.api.identitynow.com/v2024";
    },
    _headers(headers = {}) {
      return {
        ...headers,
        Accept: "application/json",
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(headers),
        ...opts,
      });
    },
    listIdentityIds(opts = {}) {
      return this._makeRequest({
        path: "/identities",
        headers: {
          "X-SailPoint-Experimental": true,
        },
        ...opts,
      });
    },
    listSoruceIds(opts = {}) {
      return this._makeRequest({
        path: "/sources",
        ...opts,
      });
    },
    submitAccessRequest(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/access-requests",
        ...opts,
      });
    },
    uploadSourceAccountFile({
      sourceId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/sources/${sourceId}/schemas/accounts`,
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/trigger-subscriptions",
        headers: {
          "X-SailPoint-Experimental": true,
        },
        ...opts,
      });
    },
    deleteWebhook(webhookId) {
      return this._makeRequest({
        method: "POST",
        path: `/trigger-subscriptions/${webhookId}`,
        headers: {
          "X-SailPoint-Experimental": true,
        },
      });
    },
  },
  async *paginate({
    fn, params = {}, maxResults = null, ...opts
  }) {
    let hasMore = false;
    let count = 0;
    let page = 0;

    do {
      params.page = ++page;
      const data = await fn({
        params,
        ...opts,
      });
      for (const d of data) {
        yield d;

        if (maxResults && ++count === maxResults) {
          return count;
        }
      }

      hasMore = data.length;

    } while (hasMore);
  },
};
