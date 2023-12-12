import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "hostaway",
  propDefinitions: {
    conversationId: {
      type: "string",
      label: "Conversation",
      description: "Identifier of a conversation",
      async options({
        page, reservationId,
      }) {
        const limit = constants.DEFAULT_LIMIT;
        const params = {
          reservationId,
          limit,
          offset: limit * page,
        };
        const { result } = await this.listConversations({
          params,
        });
        return result?.map(({
          id: value, recipientName,
        }) => ({
          value,
          label: `${value} - ${recipientName}`,
        })) || [];
      },
    },
    listingId: {
      type: "string",
      label: "Listing",
      description: "Identifier of a listing",
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const params = {
          limit,
          offset: limit * page,
        };
        const { result } = await this.listListings({
          params,
        });
        return result?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    reservationId: {
      type: "string",
      label: "Reservation",
      description: "Identifier of a reservation",
      optional: true,
      async options({
        page, listingId,
      }) {
        const limit = constants.DEFAULT_LIMIT;
        const params = {
          listingId,
          limit,
          offset: limit * page,
        };
        const { result } = await this.listReservations({
          params,
        });
        return result?.map(({
          id: value, listingName,
        }) => ({
          value,
          label: `${value} - ${listingName}`,
        })) || [];
      },
    },
    userId: {
      type: "string",
      label: "User",
      description: "Identifier of a user",
      optional: true,
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const params = {
          limit,
          offset: limit * page,
        };
        const { result } = await this.listUsers({
          params,
        });
        return result?.map(({
          id: value, firstName, lastName,
        }) => ({
          value,
          label: `${firstName} ${lastName}`,
        })) || [];
      },
    },
    taskId: {
      type: "string",
      label: "Task",
      description: "Identifier of a task",
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const params = {
          limit,
          offset: limit * page,
        };
        const { result } = await this.listTasks({
          params,
        });
        return result?.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.hostaway.com/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Cache-control": "no-cache",
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    createWebhook(args = {}) {
      return this._makeRequest({
        path: "/webhooks/unifiedWebhooks",
        method: "POST",
        ...args,
      });
    },
    deleteWebhook({
      hookId, ...args
    }) {
      return this._makeRequest({
        path: `/webhooks/unifiedWebhooks/${hookId}`,
        method: "DELETE",
        ...args,
      });
    },
    listConversations(args = {}) {
      return this._makeRequest({
        path: "/conversations",
        ...args,
      });
    },
    listListings(args = {}) {
      return this._makeRequest({
        path: "/listings",
        ...args,
      });
    },
    listReservations(args = {}) {
      return this._makeRequest({
        path: "/reservations",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/users",
        ...args,
      });
    },
    listTasks(args = {}) {
      return this._makeRequest({
        path: "/tasks",
        ...args,
      });
    },
    createTask(args = {}) {
      return this._makeRequest({
        path: "/tasks",
        method: "POST",
        ...args,
      });
    },
    sendMessage({
      conversationId, ...args
    }) {
      return this._makeRequest({
        path: `/conversations/${conversationId}/messages`,
        method: "POST",
        ...args,
      });
    },
    updateTask({
      taskId, ...args
    }) {
      return this._makeRequest({
        path: `/tasks/${taskId}`,
        method: "PUT",
        ...args,
      });
    },
  },
};
