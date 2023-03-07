import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "swaggerhub",
  propDefinitions: {
    owner: {
      type: "string",
      label: "Owner",
      description: "The owner of the API",
    },
    api: {
      type: "string",
      label: "API",
      description: "The API in your SwaggerHub",
      async options({
        page, owner,
      }) {
        const { apis } = await this.listApis({
          owner,
          params: {
            page,
            limit: constants.ASYNC_OPTIONS_LIMIT,
          },
        });

        return {
          options: apis.map((api) => ({
            label: api.name,
            value: this._getApiId(api),
          })),
        };
      },
    },
    version: {
      type: "string",
      label: "Version",
      description: "The version of the API",
      async options({
        owner, api,
      }) {
        return this.listApiVersions({
          owner,
          api,
        });
      },
    },
  },
  methods: {
    _getApiId(api) {
      const { url } = api.properties.find((property) => property.type === "Swagger");
      const splitted = url.split("/");
      return splitted[splitted.length - 2];
    },
    _auth() {
      return this.$auth.api_key;
    },
    _baseUrl() {
      return "https://api.swaggerhub.com";
    },
    async _makeRequest({
      $ = this, path = "", ...opts
    }) {
      const response = await axios($, {
        ...opts,
        url: this._baseUrl() + path,
        headers: {
          ...opts.headers,
          Authorization: this._auth(),
        },
      });
      return response;
    },
    async listApis({
      paginate = false, owner, ...opts
    }) {
      const path = `/apis/${owner}`;

      if (paginate) {
        const results = [];
        let page = -1;

        while (true) {
          const { apis } = await this._makeRequest({
            ...opts,
            path,
            params: {
              ...opts.params,
              page: ++page,
              limit: constants.MAX_LIMIT,
            },
          });

          results.push(...apis);

          if (apis.length < constants.MAX_LIMIT) {
            return {
              apis: results,
              page,
            };
          }
        }
      }

      return this._makeRequest({
        ...opts,
        path,
      });
    },
    async listApiVersions({
      owner, api, ...opts
    }) {
      const response = await this._makeRequest({
        ...opts,
        path: `/apis/${owner}/${api}`,
      });
      return response.apis
        .map((api) => api.properties.find((property) => property.type === "X-Version"))
        .map((api) => api.value);
    },
  },
};
