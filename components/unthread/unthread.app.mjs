import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "unthread",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "ID of the Customer",
      async options() {
        const response = await this.listCustomers();
        const customersIds = response.data;
        return customersIds.map(({
          id, name,
        }) => ({
          value: id,
          label: name,
        }));
      },
    },
    slackChannelId: {
      type: "string",
      label: "Slack Channel ID",
      description: "ID the customer's Slack Channel",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the customer",
    },
    emailDomains: {
      type: "string[]",
      label: "Email Domains",
      description: "Email Domains of the customer, i.e.: `gmail.com`",
    },
    defaultTriageChannelId: {
      type: "string",
      label: "Default Triage Channel",
      description: "ID of the default triage Channel of this customer",
      optional: true,
    },
    disableAutomatedTicketing: {
      type: "boolean",
      label: "Automated Ticketing",
      description: "Disable Automated Ticketing for this customer",
      optional: true,
    },
    slackTeamId: {
      type: "string",
      label: "Slack Team ID",
      description: "ID of the Slack Team",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.unthread.io/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-Api-Key": `${this.$auth.api_key}`,
        },
      });
    },
    async createCustomer(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/customers",
        ...args,
      });
    },
    async updateCustomer({
      customerId, ...args
    }) {
      return this._makeRequest({
        method: "patch",
        path: `/customers/${customerId}`,
        ...args,
      });
    },
    async deleteCustomer({
      customerId, ...args
    }) {
      return this._makeRequest({
        method: "delete",
        path: `/customers/${customerId}`,
        ...args,
      });
    },
    async listCustomers(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/customers/list",
        ...args,
      });
    },
  },
};
