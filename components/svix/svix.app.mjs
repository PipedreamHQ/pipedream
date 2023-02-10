import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "svix",
  propDefinitions: {
    appId: {
      type: "string",
      label: "Application ID",
      description: "The application's ID or UID",
      async options() {
        const { data } = await this.listApplications();
        return data?.map((app) => ({
          label: app.name,
          value: app.id,
        })) || [];
      },
    },
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      description: "The type of events to watch for",
      async options() {
        const { data } = await this.listEventTypes();
        return data?.map((type) => type.name) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.svix.com/api/v1";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      const config = {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      };
      return axios($, config);
    },
    createEndpoint(appId, args = {}) {
      return this._makeRequest({
        path: `/app/${appId}/endpoint/`,
        method: "POST",
        ...args,
      });
    },
    deleteEndpoint(appId, endpointId, args = {}) {
      return this._makeRequest({
        path: `/app/${appId}/endpoint/${endpointId}/`,
        method: "DELETE",
        ...args,
      });
    },
    listApplications(args = {}) {
      return this._makeRequest({
        path: "/app/",
        ...args,
      });
    },
    listEventTypes(args = {}) {
      return this._makeRequest({
        path: "/event-type/",
        ...args,
      });
    },
  },
};
