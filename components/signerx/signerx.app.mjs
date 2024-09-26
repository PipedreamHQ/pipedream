import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "signerx",
  propDefinitions: {
    packageId: {
      type: "string",
      label: "Package ID",
      description: "The ID of the package",
      async options({ page }) {
        const { data } = await this.listPackages({
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
  },
  methods: {
    _baseUrl() {
      return "https://api.signerx.com";
    },
    _headers(headers = {}) {
      return {
        ...headers,
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
    listPackages(opts = {}) {
      return this._makeRequest({
        path: "/packages",
        ...opts,
      });
    },
    addRecipientToTemplate({
      packageId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/packages/${packageId}/recipients`,
        ...opts,
      });
    },
    createDraftPackage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/packages/create-and-upload",
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
        params.page = ++page;
        const {
          data,
          next_page_url,
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

        hasMore = next_page_url;

      } while (hasMore);
    },
  },
};
