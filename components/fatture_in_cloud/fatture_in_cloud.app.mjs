import { axios } from "@pipedream/platform";
import { EVENT_TYPES_OPTIONS } from "./common/constants.mjs";

export default {
  type: "app",
  app: "fatture_in_cloud",
  propDefinitions: {
    companyId: {
      type: "string",
      label: "Company ID",
      description: "The ID of the company",
      async options({ page }) {
        const { data: { companies } } = await this.listCompanies({
          params: {
            page: page + 1,
          },
        });

        return companies.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    clientId: {
      type: "string",
      label: "Client ID",
      description: "The ID of the client",
      async options({
        page, companyId,
      }) {
        const { data } = await this.listClients({
          companyId,
          params: {
            page: page + 1,
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
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      description: "The types of the event.",
      options: EVENT_TYPES_OPTIONS,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api-v2.fattureincloud.it";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    createWebhook({
      companyId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/c/${companyId}/subscriptions`,
        ...opts,
      });
    },
    deleteWebhook({
      companyId, webhookId,
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/c/${companyId}/subscriptions/${webhookId}`,
      });
    },
    createClient({
      companyId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/c/${companyId}/entities/clients`,
        ...opts,
      });
    },
    listClients({ companyId }) {
      return this._makeRequest({
        path: `/c/${companyId}/entities/clients`,
      });
    },
    listCompanies(opts = {}) {
      return this._makeRequest({
        path: "/user/companies/",
        ...opts,
      });
    },
    removeClient({
      companyId, clientId,
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/c/${companyId}/entities/clients/${clientId}`,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const {
          data,
          current_page,
          last_page,
        } = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = !(current_page == last_page);

      } while (hasMore);
    },
  },
};
