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
    messageId: {
      type: "string",
      label: "Message ID",
      description: "The message's ID or eventID",
      async options({
        appId, prevContext,
      }) {
        const params = prevContext.iterator
          ? {
            iterator: prevContext.iterator,
          }
          : {};
        const {
          data, iterator: nextIterator,
        } = await this.listMessages(appId, params);
        const options = data?.map((message) => message.id) || [];
        return {
          options,
          context: {
            iterator: nextIterator,
          },
        };
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
    listMessages(appId, args = {}) {
      return this._makeRequest({
        path: `/app/${appId}/msg/`,
        ...args,
      });
    },
    createMessage(appId, args = {}) {
      return this._makeRequest({
        path: `/app/${appId}/msg/`,
        method: "POST",
        ...args,
      });
    },
    deleteMessage(appId, messageId, args = {}) {
      return this._makeRequest({
        path: `/app/${appId}/msg/${messageId}/content/`,
        method: "DELETE",
        ...args,
      });
    },
  },
};
