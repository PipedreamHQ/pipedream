import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dromo",
  propDefinitions: {
    schemaId: {
      type: "string",
      label: "Schema",
      description: "The ID of the import schema",
      async options() {
        const schemas = await this.getSchemas();
        return schemas.map((schema) => ({
          label: schema.name,
          value: schema.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.dromo.io/api/v1";
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        url,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: url || this._baseUrl() + path,
        headers: {
          ...headers,
          "X-Dromo-License-Key": `${this._apiKey()}`,
        },
      });
    },
    getHeadlessImport({
      importId, ...args
    }) {
      return this._makeRequest({
        path: `/headless/imports/${importId}/`,
        ...args,
      });
    },
    getSchemas(args = {}) {
      return this._makeRequest({
        path: "/schemas/",
        ...args,
      });
    },
    listHeadlessImports(args = {}) {
      return this._makeRequest({
        path: "/headless/imports/",
        ...args,
      });
    },
    createHeadlessImport(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/headless/imports/",
        ...args,
      });
    },
    async *paginate({
      resourceFn, args = {},
    }) {
      args = {
        ...args,
        params: {
          ...args.params,
          limit: 100,
          offset: 0,
        },
      };
      let total = 0;

      do {
        const { results } = await resourceFn(args);
        for (const item of results) {
          yield item;
        }
        total = results?.length;
        args.params.offset += args.params.limit;
      } while (total === args.params.limit);
    },
  },
};
