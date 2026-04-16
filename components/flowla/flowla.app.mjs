import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "flowla",
  propDefinitions: {
    companyId: {
      type: "string",
      label: "Company ID",
      description: "The ID of the company",
      async options({ page }) {
        const companies = await this.listCompanies({
          params: {
            page: page + 1,
          },
        });
        return companies?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
    labelId: {
      type: "string",
      label: "Label ID",
      description: "The ID of the label",
      async options({ page }) {
        const labels = await this.listLabels({
          params: {
            page: page + 1,
          },
        });
        return labels?.map(({
          id, title,
        }) => ({
          label: title,
          value: id,
        })) || [];
      },
    },
    statusId: {
      type: "string",
      label: "Status ID",
      description: "The ID of the status",
      async options({ page }) {
        const statuses = await this.listStatuses({
          params: {
            page: page + 1,
          },
        });
        return statuses?.map(({
          id, title,
        }) => ({
          label: title,
          value: id,
        })) || [];
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
      async options({ page }) {
        const users = await this.listUsers({
          params: {
            page: page + 1,
          },
        });
        return users?.map(({
          id, fullName,
        }) => ({
          label: fullName,
          value: id,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.flowla.com/api/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "x-flowla-api-key": this.$auth.api_key,
        },
        ...opts,
      });
    },
    listFlows(opts = {}) {
      return this._makeRequest({
        path: "/flows",
        ...opts,
      });
    },
    listCompanies(opts = {}) {
      return this._makeRequest({
        path: "/companies",
        ...opts,
      });
    },
    listLabels(opts = {}) {
      return this._makeRequest({
        path: "/labels",
        ...opts,
      });
    },
    listStatuses(opts = {}) {
      return this._makeRequest({
        path: "/statuses",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    createFlowFromTemplate(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/templates",
        ...opts,
      });
    },
    async *paginate({
      fn, params, max,
    }) {
      params = {
        ...params,
        page: 1,
        limit: 100,
      };
      let count = 0, hasMore = true;
      do {
        const results = await fn({
          params,
        });
        if (!results?.length) {
          return;
        }
        for (const result of results) {
          yield result;
          if (max && ++count >= max) {
            return;
          }
        }
        params.page++;
        hasMore = results.length === params.limit;
      } while (hasMore);
    },
    async getPaginatedResources(opts = {}) {
      const results = [];
      for await (const result of this.paginate(opts)) {
        results.push(result);
      }
      return results;
    },
  },
};
