import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "heartbeat",
  propDefinitions: {
    groupID: {
      type: "string",
      label: "Group ID",
      description: "The ID of the group",
      async options() {
        const groups = await this.getGroups();
        return groups.map((group) => ({
          label: group.name,
          value: group.id,
        }));
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
      async options({ onlyAdmin = false }) {
        const users = await this.getUsers();
        return users
          .filter(({ isAdmin }) => onlyAdmin
            ? isAdmin
            : true)
          .map(({
            email, name, id: value,
          }) => ({
            label: `${name} (${email})`,
            value,
          }));
      },
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "The emails of the users that should be added to the group",
      async options() {
        const users = await this.getUsers();
        return users.map((user) => user.email);
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.heartbeat.chat/v0";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    getUsers() {
      return this._makeRequest({
        path: "/users",
      });
    },
    getUser(userID) {
      return this._makeRequest({
        method: "GET",
        path: `/users/${userID}`,
      });
    },
    getGroups() {
      return this._makeRequest({
        path: "/groups",
      });
    },
    getEvent(eventID) {
      return this._makeRequest({
        method: "GET",
        path: `/events/${eventID}`,
      });
    },
    addToGroup({
      groupID, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/groups/${groupID}/memberships`,
        ...args,
      });
    },
    sendDirectMessage(args = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/directMessages",
        ...args,
      });
    },
    createEvent(args = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/events",
        ...args,
      });
    },
    createHook(args = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/webhooks",
        ...args,
      });
    },
    deleteHook(webhookID) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookID}`,
      });
    },
  },
};
