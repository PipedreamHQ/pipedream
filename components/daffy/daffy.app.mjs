import { axios } from "@pipedream/platform";
import { defineApp } from "@pipedream/types";

export default defineApp({
  type: "app",
  app: "daffy",
  propDefinitions: {
    causeId: {
      type: "string",
      label: "Cause",
      description: "The ID of the main cause.",
      async options() {
        const data = await this.listCauses();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    ein: {
      type: "string",
      label: "EIN",
      description: "The Employer Identification Number of the non-profit.",
      async options({
        page, causeId,
      }) {
        const { items: data } = await this.listNonProfits({
          params: {
            cause_id: causeId,
            page: page + 1,
          },
        });

        return data.map(({
          ein: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://public.daffy.org/v1";
    },
    _getHeaders() {
      return {
        "X-Api-Key": this.$auth.api_key,
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
    async createDonation(args = {}) {
      const userId = await this.getMe();
      return this._makeRequest({
        method: "POST",
        path: `users/${userId}/donations`,
        ...args,
      });
    },
    listNonProfits(args = {}) {
      return this._makeRequest({
        path: "non_profits",
        ...args,
      });
    },
    async listCauses(args = {}) {
      const userId = await this.getMe();
      return this._makeRequest({
        path: `users/${userId}/causes`,
        ...args,
      });
    },
    async listDonations(args = {}) {
      const userId = await this.getMe();
      return this._makeRequest({
        path: `users/${userId}/donations`,
        ...args,
      });
    },
    async getMe(args = {}) {
      const { id: userId } = await this._makeRequest({
        path: "users/me",
        ...args,
      });

      return userId;
    },
    async *paginate({
      fn, params = {},
    }) {
      let firstPage = false;
      let page = 1;
      let firstRequest = 1;

      do {
        params.page = page--;
        const {
          items,
          meta: {
            page: currentPage,
            last,
          },
        } = await fn({
          params,
        });
        if (firstRequest) {
          page = last;
          firstRequest = 0;
        } else {
          for (const d of items) {
            yield d;
          }

          firstPage = (currentPage === 1);
        }
      } while (!firstPage);
    },
  },
});
