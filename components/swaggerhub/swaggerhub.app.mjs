import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "swaggerhub",
  propDefinitions: {
    owner: {
      type: "string",
      label: "Owner",
      description: "The owner of the API .e.g HUNGV. Please tap Refresh field on the other props after you change the value in this prop to get the up-to-date data.",
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
            value: this.getApiId(api),
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
        const response = await this.listApiVersions({
          owner,
          api,
        });
        return response.map((api) => this.extractApiVersion(api));
      },
    },
  },
  methods: {
    getApiId(api) {
      const { url } = api.properties.find((property) => property.type === "Swagger");
      const splitted = url.split("/");
      return splitted[splitted.length - 2];
    },
    extractApiVersion(api) {
      return this.extractPropertyValue(api, "X-Version");
    },
    extractPropertyValue(api, propertyType) {
      const { value } = api.properties.find((property) => property.type === propertyType);
      return value;
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
      const { apis } = await this._makeRequest({
        ...opts,
        path: `/apis/${owner}/${api}`,
      });
      return apis;
    },
    async cloneApiVersion({
      owner, api, version, newVersion, makePrivate, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        path: `/apis/${owner}/${api}/${version}/clone`,
        method: "post",
        data: {
          version: newVersion,
          private: makePrivate,
        },
      });
    },
    async deleteApiVersion({
      owner, api, version, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        path: `/apis/${owner}/${api}/${version}`,
        method: "delete",
      });
    },
  },
};
