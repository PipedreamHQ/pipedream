import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "timeular",
  propDefinitions: {
    activityId: {
      type: "string",
      label: "Activity Id",
      description: "The Id of the activity.",
      async options({ page }) {
        const { activities } = await this.listActivities({
          params: {
            page,
          },
        });

        return activities.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    integration: {
      type: "string",
      label: "Integration",
      description: "The integration you want to use.",
      async options({ page }) {
        const { integrations } = await this.listIntegrations({
          params: {
            page,
          },
        });

        return integrations.map((integration) => integration);
      },
    },
    spaceId: {
      type: "string",
      label: "Space Id",
      description: "The Id of the space.",
      async options() {
        const { data } = await this.listSpaces();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.timeular.com/api/v3";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    createActivities(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "activities",
        ...args,
      });
    },
    createHook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "webhooks/subscription",
        ...args,
      });
    },
    createTag(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "tags",
        ...args,
      });
    },
    createTimeEntry(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "time-entries",
        ...args,
      });
    },
    deleteHook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `webhooks/subscription/${hookId}`,
      });
    },
    listActivities(args = {}) {
      return this._makeRequest({
        path: "activities",
        ...args,
      });
    },
    listIntegrations(args = {}) {
      return this._makeRequest({
        path: "integrations",
        ...args,
      });
    },
    listSpaces(args = {}) {
      return this._makeRequest({
        path: "space",
        ...args,
      });
    },
  },
};
