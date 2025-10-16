import { Transloadit } from "transloadit";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "transloadit",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the Template that contains your Assembly Instructions. If you set `Allow steps Override` to `false` then `steps` and `Template Id` will be mutually exclusive and you may only supply one of these parameters.",
      async options({ page }) {
        const { items } = await this.listTemplates({
          params: {
            page: page * LIMIT,
            pagesize: LIMIT,
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
    assemblyId: {
      type: "string",
      label: "Assembly ID",
      description: "The ID of the assembly.",
      async options({ page }) {
        const { items } = await this.listAssemblies({
          params: {
            page: page * LIMIT,
            pagesize: LIMIT,
          },
        });

        return items.map(({ id }) => id);
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api2.transloadit.com";
    },
    _client() {
      return new Transloadit({
        authKey: this.$auth.auth_key,
        authSecret: this.$auth.auth_secret,
      });
    },
    createAssembly(opts = {}) {
      const client = this._client();
      return client.createAssembly({
        ...opts,
        waitForCompletion: true,
      });
    },
    listAssemblies(opts = {}) {
      const client = this._client();
      return client.listAssemblies(opts);
    },
    listTemplates(opts = {}) {
      const client = this._client();
      return client.listTemplates(opts);
    },
    cancelAssembly(assemblyId) {
      const client = this._client();
      return client.cancelAssembly(assemblyId);
    },
    getAssemblyStatus(assemblyId) {
      const client = this._client();
      return client.getAssembly(assemblyId);
    },
    async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        params.pagesize = LIMIT;
        const { items } = await fn(params);
        for (const d of items) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = items.length;

      } while (hasMore);
    },
  },
};
