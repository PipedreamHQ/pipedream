import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "bloomerang",
  propDefinitions: {
    constituentId: {
      type: "string",
      label: "Constituent ID",
      description: "The ID of the constituent",
      async options({ page }) {
        const { Results: response } = await this.listConstituents({
          params: {
            skip: LIMIT * page,
            take: LIMIT,
          },
        });
        return response.map(({
          Id: value, FullName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    fundId: {
      type: "string",
      label: "Fund",
      description: "Filter donations by fund",
      async options({ page }) {
        const { Results: response } = await this.listFunds({
          params: {
            skip: LIMIT * page,
            take: LIMIT,
          },
        });
        return response.map(({
          Id: value, Name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    campaignId: {
      type: "string",
      label: "Campaign",
      description: "Filter interactions by campaign",
      async options({ page }) {
        const { Results: response } = await this.listCampaigns({
          params: {
            skip: LIMIT * page,
            take: LIMIT,
          },
        });
        return response.map(({
          Id: value, Name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    appealId: {
      type: "string",
      label: "Appeal",
      description: "An appeal for the donation",
      async options({ page }) {
        const { Results: response } = await this.listAppeals({
          params: {
            skip: LIMIT * page,
            take: LIMIT,
          },
        });
        return response.map(({
          Id: value, Name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.bloomerang.co/v2";
    },
    _headers() {
      return {
        "accept": "application/json",
        "x-api-key": `${this.$auth.api_key}`,
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
    listConstituents(opts = {}) {
      return this._makeRequest({
        path: "/constituents",
        ...opts,
      });
    },
    listInteractions(opts = {}) {
      return this._makeRequest({
        path: "/interactions",
        ...opts,
      });
    },
    listTransactions(opts = {}) {
      return this._makeRequest({
        path: "/transactions",
        ...opts,
      });
    },
    listFunds(opts = {}) {
      return this._makeRequest({
        path: "/funds",
        ...opts,
      });
    },
    listCampaigns(opts = {}) {
      return this._makeRequest({
        path: "/campaigns",
        ...opts,
      });
    },
    listAppeals(opts = {}) {
      return this._makeRequest({
        path: "/appeals",
        ...opts,
      });
    },
    createDonation(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/transaction",
        ...opts,
      });
    },
    createConstituent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/constituent",
        ...opts,
      });
    },
    createInteraction(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/interaction",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.skip = LIMIT * page;
        params.take = LIMIT;
        page++;
        const { Results: data } = await fn({
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
  },
};
