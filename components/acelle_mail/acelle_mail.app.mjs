import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "acelle_mail",
  propDefinitions: {
    subscriberId: {
      type: "string",
      label: "Subscriber ID",
      description: "The subscriber ID",
      async options({ page }) {
        const subscribers = await this.getSubscribers({
          params: {
            page: page + 1,
          },
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

        console.log('auto-rev-test')
        console.log('auto-rev-test')

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
