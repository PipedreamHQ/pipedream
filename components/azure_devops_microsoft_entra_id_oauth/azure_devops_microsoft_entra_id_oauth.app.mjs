import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "azure_devops_microsoft_entra_id_oauth",
  propDefinitions: {
    eventType: {
      type: "string",
      label: "Event Type",
      description: "Event type to receive events for",
      async options() {
        const types = await this.listEventTypes();
        return types.filter(({ id }) => id !== "tfvc.checkin" && id !== "build.complete").map(({ id }) => id);
      },
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "Project ID to receive events for",
      async options() {
        const projects = await this.listProjects();
        return projects?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://dev.azure.com/${this.$auth.organization}/_apis`;
    },
    _makeRequest({
      $ = this, path, params, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "content-type": "application/json",
        },
        params: {
          ...params,
          "api-version": "7.1",
        },
        ...opts,
      });
    },
    async listEventTypes(opts = {}) {
      const { value } = await this._makeRequest({
        path: "/hooks/publishers/tfs/eventtypes",
        ...opts,
      });
      return value;
    },
    async listProjects(opts = {}) {
      const { value } = await this._makeRequest({
        path: "/projects",
        ...opts,
      });
      return value;
    },
    createSubscription(opts = {}) {
      return  this._makeRequest({
        method: "POST",
        path: "/hooks/subscriptions",
        ...opts,
      });
    },
    deleteSubscription(subscriptionId, opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/hooks/subscriptions/${subscriptionId}`,
        ...opts,
      });
    },
  },
};
