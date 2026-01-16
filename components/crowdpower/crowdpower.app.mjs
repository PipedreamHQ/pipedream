import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "crowdpower",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project can be found in the `Edit Project` page",
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "ID of the user",
      async options({
        projectId, page, query,
      }) {
        const response = await this.getCustomers({
          projectId,
          params: {
            q: query,
            page: page + 1,
          },
        });
        const users = response.data;
        return users.map(({
          id, name,
        }) => ({
          value: id,
          label: name,
        }));
      },
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "Amount of the charge",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the customer",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the customer",
    },
    customAttributes: {
      type: "object",
      label: "Custom Attributes",
      description: "Custom attributes in JSON format, i.e.: \"username\": \"billy\", \"type\": \"subscription\"",
    },
    action: {
      type: "string",
      label: "Action",
      description: "Action related to the event",
    },
    properties: {
      type: "object",
      label: "Properties",
      description: "Properties of the event that will be created, i.e.: `\"method\": \"Google\"`",
    },
  },
  methods: {
    _baseUrl() {
      return "https://beacon.crowdpower.io";
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
          "Authorization": `Bearer ${this.$auth.application_key}`,
          ...headers,
        },
      });
    },

    async createCustomerCharge(args = {}) {
      return this._makeRequest({
        path: "/charges",
        method: "post",
        ...args,
      });
    },
    async upsertCustomer(args = {}) {
      return this._makeRequest({
        path: "/customers",
        method: "post",
        ...args,
      });
    },
    async createCustomerEvent(args = {}) {
      return this._makeRequest({
        path: "/events",
        method: "post",
        ...args,
      });
    },
    async getCustomers({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `/v1/projects/${projectId}/customers`,
        ...args,
      });
    },
  },
};
