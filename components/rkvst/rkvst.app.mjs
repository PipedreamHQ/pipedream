import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "rkvst",
  propDefinitions: {
    assetId: {
      type: "string",
      label: "Asset ID",
      description: "The unique identifier of the asset",
      async options({ prevContext: { pageToken = null } }) {
        const {
          assets, next_page_token,
        } = await this.listAssets({
          params: {
            page_token: pageToken,
          },
        });

        return {
          options: assets.map(({ identity }) => identity),
          context: {
            pageToken: next_page_token,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.datatrails.ai/archivist/v2";
    },
    _headers() {
      return {
        "Content-type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    createAsset(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/assets",
        ...opts,
      });
    },
    listAssets(opts = {}) {
      return this._makeRequest({
        path: "/assets",
        ...opts,
      });
    },
    listEvents({
      assetId, ...opts
    }) {
      return this._makeRequest({
        path: `/${assetId}/events`,
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, dataField, ...opts
    }) {
      let pageToken = null;

      do {
        params.page_token = pageToken;
        const response = await fn({
          params,
          ...opts,
        });

        for (const d of response[dataField]) {
          yield d;
        }
        pageToken = response.next_page_token;

      } while (pageToken);
    },
  },
};
