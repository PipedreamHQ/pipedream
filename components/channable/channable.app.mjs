import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "channable",
  propDefinitions: {
    stockUpdateId: {
      type: "string",
      label: "Stock Update ID",
      description: "The ID of a stock update",
      async options({ page }) {
        const { offers } = await this.listStockUpdates({
          params: {
            limit: 100,
            offset: page * 100,
          },
        });
        return offers?.map((offer) => ({
          label: offer.label,
          value: offer.id,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.channable.com/v1";
    },
    _companyId() {
      return this.$auth.company_id;
    },
    _projectId() {
      return this.$auth.project_id;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
        ...opts,
      });
    },
    listStockUpdates(opts = {}) {
      return this._makeRequest({
        path: `/companies/${this._companyId()}/projects/${this._projectId()}/offers`,
        ...opts,
      });
    },
    updateStockUpdate(opts = {}) {
      return this._makeRequest({
        path: `/companies/${this._companyId()}/projects/${this._projectId()}/stock_updates`,
        method: "POST",
        ...opts,
      });
    },
    async *paginate({
      fn, args, resourceKey, max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          limit: 100,
          offset: 0,
        },
      };
      let total, count = 0;
      do {
        const response = await fn(args);
        const items = response[resourceKey];
        total = items?.length;
        if (!total) {
          return;
        }
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        args.params.offset += args.params.limit;
      } while (total === args.params.limit);
    },
    async getPaginatedResources(opts) {
      const resources = [];
      for await (const resource of this.paginate(opts)) {
        resources.push(resource);
      }
      return resources;
    },
  },
};
