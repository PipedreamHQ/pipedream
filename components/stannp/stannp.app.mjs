import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "stannp",
  propDefinitions: {
    groupId: {
      type: "string",
      label: "Group ID",
      description: "Select the group ID",
      async options() {
        const { data } = await this.listGroups();
        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "Select the campaign ID",
      async options() {
        const { data } = await this.listCampaigns();
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
      return `https://${this.$auth.region}.stannp.com/api/v1`;
    },
    _auth() {
      return {
        "username": `${this.$auth.api_key}`,
        "password": "",
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: this._auth(),
        ...opts,
      });
    },
    listGroups(opts = {}) {
      return this._makeRequest({
        path: "/groups/list",
        ...opts,
      });
    },
    listCampaigns(opts = {}) {
      return this._makeRequest({
        path: "/campaigns/list",
        ...opts,
      });
    },
    listRecipients(opts = {}) {
      return this._makeRequest({
        path: "/recipients/list",
        ...opts,
      });
    },
    createCampaign(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/campaigns/create",
        ...opts,
      });
    },
    getCampaign({
      campaignId, ...opts
    }) {
      return this._makeRequest({
        path: `/campaigns/get/${campaignId}`,
        ...opts,
      });
    },
    createRecipient(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/recipients/new",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.limit = LIMIT;
        params.offset = LIMIT * page;
        page++;
        const { data } = await fn({
          params,
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
  },
};
