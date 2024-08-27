import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "adrapid",
  propDefinitions: {
    bannerId: {
      type: "string",
      label: "Banner Id",
      description: "The id of the banner.",
      async options({ page }) {
        const { rows: data } = await this.listBanners({
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
    templateId: {
      type: "string",
      label: "Template Id",
      description: "The id of the template to create the banner.",
      async options({ page }) {
        const { rows: data } = await this.listTemplates({
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
      return "https://api.adrapid.com";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_token}`,
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
    listBanners(opts = {}) {
      return this._makeRequest({
        path: "/banners",
        ...opts,
      });
    },
    listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/templates",
        ...opts,
      });
    },
    getTemplate({ templateId }) {
      return this._makeRequest({
        path: `/templates/${templateId}`,
      });
    },
    getBanner({
      bannerId, ...opts
    }) {
      return this._makeRequest({
        path: `/banners/${bannerId}`,
        ...opts,
      });
    },
    createBanner(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/banners",
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
        params.offset = LIMIT * page++;
        const { rows } = await fn({
          params,
          ...opts,
        });
        for (const d of rows) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = rows.length;

      } while (hasMore);
    },
  },
};
