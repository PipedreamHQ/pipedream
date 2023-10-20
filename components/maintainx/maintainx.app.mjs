import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "maintainx",
  propDefinitions: {
    workorderId: {
      label: "Work Order ID",
      description: "The work order ID",
      type: "string",
      async options({ prevContext }) {
        const response = await this.getWorkOrders({
          params: {
            cursor: prevContext?.cursor,
          },
        });

        return {
          context: {
            cursor: response.nextCursor,
          },
          options: response.workOrders.map((workorder) => ({
            value: workorder.id,
            label: workorder.title,
          })),
        };
      },
    },
    conversationId: {
      label: "Conversation ID",
      description: "The conversation ID",
      type: "string",
      async options({ prevContext }) {
        const response = await this.getConversations({
          params: {
            cursor: prevContext?.cursor,
          },
        });

        return {
          context: {
            cursor: response.nextCursor,
          },
          options: response.conversations.map((conversation) => ({
            value: conversation.id,
            label: conversation.name,
          })),
        };
      },
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.getmaintainx.com/v1";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._apiKey()}`,
        },
        ...args,
      });
    },
    async getConversations(args = {}) {
      return this._makeRequest({
        path: "/conversations",
        ...args,
      });
    },
    async getWorkOrders(args = {}) {
      return this._makeRequest({
        path: "/workorders",
        ...args,
      });
    },
    async createWorkOrder(args = {}) {
      return this._makeRequest({
        path: "/workorders",
        method: "post",
        ...args,
      });
    },
    async updateWorkOrder({
      workorderId, ...args
    }) {
      return this._makeRequest({
        path: `/workorders/${workorderId}`,
        method: "patch",
        ...args,
      });
    },
    async sendMessage({
      conversationId, ...args
    }) {
      return this._makeRequest({
        path: `/conversations/${conversationId}/messages`,
        method: "post",
        ...args,
      });
    },
  },
};
