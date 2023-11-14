import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "helpcrunch",
  propDefinitions: {
    chatId: {
      type: "string",
      label: "Chat ID",
      description: "The ID of the chat",
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The ID of the customer",
    },
    customerAttributes: {
      type: "object",
      label: "Customer Attributes",
      description: "Attributes to search or create the customer",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.helpcrunch.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async getChat(chatId) {
      return this._makeRequest({
        path: `/chats/${chatId}`,
      });
    },
    async updateChat(chatId, data) {
      return this._makeRequest({
        method: "PUT",
        path: `/chats/${chatId}`,
        data,
      });
    },
    async createChat(data) {
      return this._makeRequest({
        method: "POST",
        path: "/chats",
        data,
      });
    },
    async getCustomer(customerId) {
      return this._makeRequest({
        path: `/customers/${customerId}`,
      });
    },
    async createCustomer(data) {
      return this._makeRequest({
        method: "POST",
        path: "/customers",
        data,
      });
    },
    async searchOrCreateCustomer(attributes) {
      try {
        const searchResponse = await this._makeRequest({
          method: "GET",
          path: "/customers/search",
          params: attributes,
        });
        if (searchResponse && searchResponse.length > 0) {
          return searchResponse[0];
        }
      } catch (error) {
        console.error("Error searching for customer", error);
      }
      return this.createCustomer(attributes);
    },
  },
};
