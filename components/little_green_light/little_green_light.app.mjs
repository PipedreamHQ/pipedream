import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "little_green_light",
  propDefinitions: {
    appealId: {
      type: "string",
      label: "Appeal ID",
      description: "The ID of the appeal.",
      async options({ page }) {
        const { items } = await this.listAppeals({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    constituentId: {
      type: "string",
      label: "Constituent ID",
      description: "The ID of the constituent in Little Green Light.",
      async options({ page }) {
        const { items } = await this.listConstituents({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return items.map(({
          id: value, first_name: fName, last_name: lName, org_name: orgName,
        }) => ({
          label: fName
            ? `${fName} ${lName}`
            : orgName,
          value,
        }));
      },
    },
    fundId: {
      type: "string",
      label: "Fund ID",
      description: "The ID of the fund.",
      async options({ page }) {
        const { items } = await this.listFunds({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    giftCategoryId: {
      type: "string",
      label: "Gift Category ID",
      description: "The ID of the gift category.",
      async options({ page }) {
        const { items } = await this.listGiftCategories({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return items.map(({
          id: value, display_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    giftTypeId: {
      type: "string",
      label: "Gift Type ID",
      description: "The ID of the gift type.",
      async options({ page }) {
        const { items } = await this.listGiftTypes({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return items.map(({
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
      return "https://api.littlegreenlight.com/api/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
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
    getConstituent({
      constituentId, ...opts
    }) {
      return this._makeRequest({
        path: `/constituents/${constituentId}`,
        ...opts,
      });
    },
    listAppeals(opts = {}) {
      return this._makeRequest({
        path: "/appeals",
        ...opts,
      });
    },
    listConstituents(opts = {}) {
      return this._makeRequest({
        path: "/constituents",
        ...opts,
      });
    },
    listFunds(opts = {}) {
      return this._makeRequest({
        path: "/funds",
        ...opts,
      });
    },
    listGiftCategories(opts = {}) {
      return this._makeRequest({
        path: "/gift_categories",
        ...opts,
      });
    },
    listGiftTypes(opts = {}) {
      return this._makeRequest({
        path: "/gift_types",
        ...opts,
      });
    },
    createGift({
      constituentId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/constituents/${constituentId}/gifts`,
        ...opts,
      });
    },
    addConstituent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/constituents",
        ...opts,
      });
    },
    updateConstituent({
      constituentId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/constituents/${constituentId}`,
        ...opts,
      });
    },
    searchGifts(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/gifts/search",
        ...opts,
      });
    },
    searchConstituents(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/constituents/search",
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
        params.limit = LIMIT;
        params.offset = LIMIT * page;
        page++;

        const {
          items,
          items_count,
        } = await fn({
          params,
          ...opts,
        });
        for (const d of items) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = items_count === LIMIT;

      } while (hasMore);
    },
  },
};
