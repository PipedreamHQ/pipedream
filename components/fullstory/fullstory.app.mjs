import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fullstory",
  propDefinitions: {
    eventType: {
      type: "string",
      label: "Event Type",
      description: "Webhook Event Type",
      async options() {
        const resp = await this.getEventTypes();
        return resp?.eventDefs.map((def) => ({
          label: def.displayName,
          value: def.eventName,
        }));
      },
    },
    eventSubcategory: {
      type: "string",
      label: "Event Subcategory",
      description: "Webhook Event Subcategory",
      optional: true,
      async options({
        eventType,
        prevContext,
      }) {
        const resp = await this.getEventSubcategories({
          eventType,
          params: {
            paginationToken: prevContext.paginationToken,
          },
        });
        return {
          options: resp.subcategoryDefs.map((def) => ({
            label: def.displayName ?? def.subcategory,
            value: def.subcategory,
          })),
          context: {
            paginationToken: resp.nextPaginationToken,
          },
        };
      },
    },
  },
  methods: {
    _getUrl(path) {
      return `https://api.fullstory.com${path}`;
    },
    _getHeaders(headers = {}) {
      return {
        "Authorization": `Basic ${this.$auth.api_key}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
        ...headers,
      };
    },
    async _makeRequest({
      $,
      path,
      headers,
      ...otherConfig
    } = {}) {
      const config = {
        url: this._getUrl(path),
        headers: this._getHeaders(headers),
        ...otherConfig,
      };
      return axios($ ?? this, config);
    },
    async getEventTypes(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/webhooks/v1/event-types",
        ...args,
      });
    },
    async getEventSubcategories({
      eventType,
      ...args
    } = {}) {
      return this._makeRequest({
        method: "GET",
        path: `/webhooks/v1/event-types/${eventType}/subcategories`,
        ...args,
      });
    },
    async createWebhook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks/v1/endpoints",
        ...args,
      });
    },
    async deleteWebhook({
      hookId,
      ...args
    } = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/v1/endpoints/${hookId}`,
        ...args,
      });
    },
  },
};
