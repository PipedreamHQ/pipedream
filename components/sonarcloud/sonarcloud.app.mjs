import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sonarcloud",
  propDefinitions: {},
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://sonarcloud.io/api";
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks/create",
        ...opts,
      });
    },
    async updateWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks/update",
        ...opts,
      });
    },
    async emitNewIssueCreatedEvent(opts = {}) {
      // Method to emit event when a new issue is created
      return this._makeRequest({
        method: "POST", // Assuming POST method for emitting events, adjust based on actual API
        path: "/issues/events/new-created",
        ...opts,
      });
    },
    async emitIssueUpdatedEvent(opts = {}) {
      // Method to emit event when an issue is updated
      return this._makeRequest({
        method: "POST", // Assuming POST method for emitting events, adjust based on actual API
        path: "/issues/events/updated",
        ...opts,
      });
    },
    async emitIssueResolvedEvent(opts = {}) {
      // Method to emit event when an issue is set as resolved
      return this._makeRequest({
        method: "POST", // Assuming POST method for emitting events, adjust based on actual API
        path: "/issues/events/resolved",
        ...opts,
      });
    },
    async emitIssueAssignedEvent(opts = {}) {
      // Method to emit event when an issue is assigned to a user
      return this._makeRequest({
        method: "POST", // Assuming POST method for emitting events, adjust based on actual API
        path: "/issues/events/assigned",
        ...opts,
      });
    },
  },
};
