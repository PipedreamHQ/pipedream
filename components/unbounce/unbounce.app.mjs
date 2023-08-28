import { axios } from "@pipedream/platform";
import { limit } from "./common/constants.mjs";

export default {
  type: "app",
  app: "unbounce",
  propDefinitions: {
    pageId: {
      type: "string",
      label: "Page Id",
      description: "The Id of the page.",
      async options({ page }) {
        const { pages } = await this.listPages({
          params: {
            limit,
            offset: limit * page,
          },
        });

        return pages.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    leadId: {
      type: "string",
      label: "Lead Id",
      description: "The Id of the lead.",
      async options({
        page, pageId,
      }) {
        const { leads } = await this.listPageLeads({
          pageId,
          params: {
            limit,
            offset: limit * page,
          },
        });

        return leads.map(({ id }) => id);
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.unbounce.com";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Accept": "application/vnd.unbounce.api.v0.4+json",
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    getLead({
      leadId, ...args
    }) {
      return this._makeRequest({
        path: `leads/${leadId}`,
        ...args,
      });
    },
    listPages(args = {}) {
      return this._makeRequest({
        path: "pages",
        ...args,
      });
    },
    listPageLeads({
      pageId, ...args
    }) {
      return this._makeRequest({
        path: `pages/${pageId}/leads`,
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...args
    }) {
      let lastPage = false;
      let count = 0;

      do {
        const { leads } = await fn({
          params,
          ...args,
        });
        for (const d of leads) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }
        params.offset += params.limit;

        lastPage = leads.length === params.limit;

      } while (lastPage);
    },
  },
};
