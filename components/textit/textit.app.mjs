import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "textit",
  propDefinitions: {
    flowUuid: {
      label: "Flow UUID",
      description: "The UUID of the flow",
      type: "string",
      async options({ prevContext }) {
        let args = {};

        if (prevContext.nextUrl) args.url = prevContext.nextUrl;

        const response = await this.getFlows(args);

        return {
          options: response?.results?.map((flow) => ({
            label: flow.name,
            value: flow.uuid,
          })),
          context: {
            nextUrl: response?.next,
          },
        };
      },
    },
    contactUuid: {
      label: "Contact UUID",
      description: "The UUID of the contact",
      type: "string",
      async options({ prevContext }) {
        let args = {};

        if (prevContext.nextUrl) args.url = prevContext.nextUrl;

        const response = await this.getContacts(args);

        return {
          options: response?.results?.map((contact) => ({
            label: contact.name,
            value: contact.uuid,
          })),
          context: {
            nextUrl: response?.next,
          },
        };
      },
    },
    groupUuid: {
      label: "Group UUID",
      description: "The UUID of the group",
      type: "string",
      async options({ prevContext }) {
        let args = {};

        if (prevContext.nextUrl) args.url = prevContext.nextUrl;

        const response = await this.getGroups(args);

        return {
          options: response?.results?.map((group) => ({
            label: group.name,
            value: group.uuid,
          })),
          context: {
            nextUrl: response?.next,
          },
        };
      },
    },
    resthookEvent: {
      label: "Resthook event",
      description: "The resthook event",
      type: "string",
      async options({ prevContext }) {
        let args = {};

        if (prevContext.nextUrl) args.url = prevContext.nextUrl;

        const response = await this.getResthooks(args);

        return {
          options: response?.results?.map((event) => event.resthook),
          context: {
            nextUrl: response?.next,
          },
        };
      },
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://textit.in/api/v2";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Token ${this._apiKey()}`,
        },
        ...args,
      });
    },
    async createWebhook({ ...args }) {
      return this._makeRequest({
        path: "/resthook_subscribers.json",
        method: "post",
        ...args,
      });
    },
    async removeWebhook(webhookId) {
      return this._makeRequest({
        path: "/resthook_subscribers.json",
        method: "delete",
        params: {
          id: webhookId,
        },
      });
    },
    async getResthooks({ ...args } = {}) {
      return this._makeRequest({
        path: "/resthooks.json",
        ...args,
      });
    },
    async getResthookEvents({ ...args } = {}) {
      return this._makeRequest({
        path: "/resthook_events.json",
        ...args,
      });
    },
    async getContacts({ ...args } = {}) {
      return this._makeRequest({
        path: "/contacts.json",
        ...args,
      });
    },
    async getGroups({ ...args } = {}) {
      return this._makeRequest({
        path: "/groups.json",
        ...args,
      });
    },
    async startFlow({ ...args } = {}) {
      return this._makeRequest({
        path: "/flow_starts.json",
        method: "post",
        ...args,
      });
    },
  },
};
