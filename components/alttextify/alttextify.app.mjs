import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "alttextify",
  propDefinitions: {
    assetId: {
      type: "string",
      label: "Asset ID",
      description: "The ID of the asset for retrieving alt text.",
      async options({ page }) {
        const data = await this.listAltTexts({
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          asset_id: value, alt_text: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.alttextify.net/api/v1";
    },
    _headers() {
      return {
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
    uploadImage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/image/raw",
        ...opts,
      });
    },
    deleteAltTextByAssetId({
      assetId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/image/${assetId}`,
        ...opts,
      });
    },
    retrieveAltTextByAssetId({
      assetId, ...opts
    }) {
      return this._makeRequest({
        path: `/image/${assetId}`,
        ...opts,
      });
    },
    listAltTexts({ ...opts }) {
      return this._makeRequest({
        path: "/image",
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
  },
};
