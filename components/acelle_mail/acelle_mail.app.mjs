import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "acelle_mail",
  propDefinitions: {
    subscriberId: {
      type: "string",
      label: "Subscriber ID",
      description: "The subscriber ID",
      async options({
        page, listId,
      }) {
        const params = {
          page: page + 1,
        };

        if (listId) params.list_uid = listId;

        const subscribers = await this.getSubscribers({
          params,
        });

        return subscribers.map((subscriber) => ({
          label: subscriber.email,
          value: subscriber.uid,
        }));
      },
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The customer ID",
      async options({ page }) {
        const customers = await this.getCustomers({
          params: {
            page: page + 1,
          },
        });

        return customers.map((customer) => customer.uid);
      },
    },
    planId: {
      type: "string",
      label: "Plan ID",
      description: "The plan ID",
      async options({ page }) {
        const plans = await this.getPlans({
          params: {
            page: page + 1,
          },
        });

        return plans.map((plan) => ({
          label: plan.name,
          value: plan.uid,
        }));
      },
    },
    listId: {
      type: "string",
      label: "List ID",
      description: "The list ID",
      async options({ page }) {
        const lists = await this.getLists({
          params: {
            page: page + 1,
          },
        });

        return lists.map(({
          uid, name,
        }) => ({
          label: name,
          value: uid,
        }));
      },
    },
  },
  methods: {
    _apiEndpoint() {
      return this.$auth.api_endpoint;
    },
    _apiToken() {
      return this.$auth.api_token;
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiEndpoint()}${path}`,
        ...args,
        params: {
          ...args.params,
          api_token: this._apiToken(),
        },
      });
    },
    async getSubscribers(args = {}) {
      return this._makeRequest({
        path: "/subscribers",
        ...args,
      });
    },
    async getPlans(args = {}) {
      return this._makeRequest({
        path: "/plans",
        ...args,
      });
    },
    async getLists(args = {}) {
      return this._makeRequest({
        path: "/lists",
        ...args,
      });
    },
    async getCustomers(args = {}) {
      return this._makeRequest({
        path: "/customers",
        ...args,
      });
    },
    async createCustomer(args = {}) {
      return this._makeRequest({
        path: "/customers",
        method: "post",
        ...args,
      });
    },
    async updateSubscriber({
      subscriberId, ...args
    }) {
      return this._makeRequest({
        path: `/subscribers/${subscriberId}`,
        method: "patch",
        ...args,
      });
    },
    async subscribeToList({
      listId, subscriberId, ...args
    }) {
      return this._makeRequest({
        path: `/lists/${listId}/subscribers/${subscriberId}/subscribe`,
        method: "patch",
        ...args,
      });
    },
    async unsubscribeFromList({
      listId, subscriberId, ...args
    }) {
      return this._makeRequest({
        path: `/lists/${listId}/subscribers/${subscriberId}/unsubscribe`,
        method: "patch",
        ...args,
      });
    },
    async subscribeCustomerToPlan({
      customerId, planId, ...args
    }) {
      return this._makeRequest({
        path: `/customers/${customerId}/assign-plan/${planId}`,
        method: "post",
        ...args,
      });
    },
    async addTagToSubscriber(args = {}) {
      return this._makeRequest({
        path: "/subscribers",
        method: "post",
        ...args,
      });
    },
  },
};
