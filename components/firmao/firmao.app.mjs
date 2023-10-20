import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "firmao",
  propDefinitions: {
    responsibleUsers: {
      type: "string[]",
      label: "Responsible Users",
      description: "Array of users responsible for the task",
      async options() {
        const users = await this.getUsers();
        return users.data.map((user) => ({
          label: user.label,
          value: user.id,
        }));
      },
    },
    customers: {
      type: "string[]",
      label: "Customers",
      description: "Array of customers to be added in an offer",
      async options() {
        const users = await this.getCustomers();
        return users.data.map((user) => ({
          label: user.label,
          value: user.id,
        }));
      },
    },
  },
  methods: {
    getUrl(endpoint) {
      return `https://system.firmao.net${endpoint}`;
    },
    getAuth(auth) {
      return {
        username: `${this.$auth.api_login}`,
        password: `${this.$auth.api_password}`,
        ...auth,
      };
    },
    makeRequest({
      $ = this, path, auth, ...args
    } = {}) {
      const config = {
        auth: this.getAuth(auth),
        url: this.getUrl(path),
        ...args,
      };
      return axios($, config);
    },
    createCustomer(args = {}) {
      return this.makeRequest({
        method: "POST",
        path: `/${this.$auth.organization_id}/svc/v1/customers`,
        ...args,
      });
    },
    createTask(args = {}) {
      return this.makeRequest({
        method: "POST",
        path: `/${this.$auth.organization_id}/svc/v1/tasks`,
        ...args,
      });
    },
    createOffer(args = {}) {
      return this.makeRequest({
        method: "POST",
        path: `/${this.$auth.organization_id}/svc/v1/offers`,
        ...args,
      });
    },
    getUsers(args = {}) {
      return this.makeRequest({
        method: "GET",
        path: `/${this.$auth.organization_id}/svc/v1/users`,
        ...args,
      });
    },
    getCustomers(args = {}) {
      return this.makeRequest({
        method: "GET",
        path: `/${this.$auth.organization_id}/svc/v1/customers`,
        ...args,
      });
    },
    getTasks(args = {}) {
      return this.makeRequest({
        method: "GET",
        path: `/${this.$auth.organization_id}/svc/v1/tasks`,
        ...args,
      });
    },
    getOffers(args = {}) {
      return this.makeRequest({
        method: "GET",
        path: `/${this.$auth.organization_id}/svc/v1/offers`,
        ...args,
      });
    },
  },
};
