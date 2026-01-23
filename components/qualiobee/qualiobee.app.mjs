import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "qualiobee",
  propDefinitions: {
    moduleUuid: {
      type: "string",
      label: "Module UUID",
      description: "The UUID of a module",
      async options({ page }) {
        const { data } = await this.listModules({
          params: {
            page: page + 1,
            limit: 100,
          },
        });
        return data?.map(({
          uuid, name,
        }) => ({
          value: uuid,
          label: name,
        })) || [];
      },
    },
    customerUuid: {
      type: "string",
      label: "Customer UUID",
      description: "The UUID of a customer",
      async options({ page }) {
        const { data } = await this.listCustomers({
          params: {
            page: page + 1,
            limit: 100,
          },
        });
        return data?.map(({
          uuid, name,
        }) => ({
          value: uuid,
          label: name,
        })) || [];
      },
    },
    learnerUuid: {
      type: "string",
      label: "Learner UUID",
      description: "The UUID of a learner",
      async options({ page }) {
        const { data } = await this.listLearners({
          params: {
            page: page + 1,
            limit: 100,
          },
        });
        return data?.map(({
          uuid, firstName, lastName,
        }) => ({
          value: uuid,
          label: `${firstName} ${lastName}`,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://app.beehelp.fr/api/${this.$auth.organization_uuid}`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "x-api-key": this.$auth.api_key,
        },
        ...opts,
      });
    },
    getLearner({
      learnerUuid, ...opts
    }) {
      return this._makeRequest({
        path: `/learner/${learnerUuid}`,
        ...opts,
      });
    },
    listModules(opts = {}) {
      return this._makeRequest({
        path: "/module",
        ...opts,
      });
    },
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customer",
        ...opts,
      });
    },
    listLearners(opts = {}) {
      return this._makeRequest({
        path: "/learner",
        ...opts,
      });
    },
    updateCustomer({
      customerUuid, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/customer/${customerUuid}`,
        ...opts,
      });
    },
    async *paginate({
      resourceFn, params, max,
    }) {
      params = {
        ...params,
        page: 1,
        limit: 100,
      };
      let total, count = 0;
      do {
        const { data } = await resourceFn({
          params,
        });
        if (!data?.length) {
          return;
        }
        for (const item of data) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }
        total = data?.length;
        params.page++;
      } while (total === params.limit);
    },
  },
};
