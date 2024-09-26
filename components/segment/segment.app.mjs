import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "segment",
  propDefinitions: {
    context: {
      type: "object",
      label: "Context",
      description: "Dictionary of extra information that provides useful context about a message, but is not directly related to the API call like ip address or locale",
      optional: true,
    },
    integrations: {
      type: "object",
      label: "Integrations",
      description: "Dictionary of destinations to either enable or disable",
      optional: true,
    },
    timestamp: {
      type: "string",
      label: "Timestamp",
      description: "Timestamp when the message itself took place, defaulted to the current time by the Segment Tracking API. It is an [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) date string. For example, `2022-04-08T17:32:11.318Z`",
      optional: true,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "Unique identifier for the user in your database., A **User ID** or an **Anonymous ID** is required.",
      optional: true,
    },
    anonymousId: {
      type: "string",
      label: "Anonymous ID",
      description: "A pseudo-unique substitute for a User ID, for cases when you don't have an absolutely unique identifier. A **User ID** or an **Anonymous ID** is required.",
      optional: true,
    },
    workspace: {
      type: "string",
      label: "Workspace",
      description: "Workspace to use for this destination",
      async options() {
        const { data } = await this.listWorkspaces();
        return [
          {
            value: data.workspace.id,
            label: data.workspace.name,
          },
        ];
      },
    },
    source: {
      type: "string",
      label: "Source",
      description: "The source to send events to",
      async options({ prevContext }) {
        const { cursor } = prevContext;
        const params = {
          pagination: {
            count: 10,
          },
        };
        if (cursor) {
          params.pagination.cursor = cursor;
        }

        const { data } = await this.listSources({
          params,
        });

        const options = data.sources.map(({
          id, name,
        }) => ({
          value: id,
          label: name,
        }));

        const nextCursor = data.pagination?.next;

        return {
          options,
          context: {
            cursor: nextCursor,
          },
        };
      },
    },
  },
  methods: {
    getConfigApiBaseUrl() {
      return "https://api.segmentapis.com";
    },
    getTrackingApiBaseUrl() {
      return "https://api.segment.io/v1";
    },
    getConfigApiUrl(path) {
      const baseUrl = this.getConfigApiBaseUrl();
      return `${baseUrl}${path}`;
    },
    getTrackingApiUrl(path) {
      const baseUrl = this.getTrackingApiBaseUrl();
      return `${baseUrl}${path}`;
    },
    getConfigApiHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.access_token}`,
      };
    },
    getTrackingAuth() {
      return {
        username: `${this.$auth.write_key}`,
        password: "",
      };
    },
    async makeRequest(customConfig) {
      const {
        $,
        api = constants.API.CONFIG,
        method,
        path,
        ...otherConfig
      } = customConfig;

      const url = api === constants.API.CONFIG
        ? this.getConfigApiUrl(path)
        : this.getTrackingApiUrl(path);

      const config = {
        method,
        url,
        ...otherConfig,
      };

      if (api === constants.API.CONFIG) {
        config.headers = this.getConfigApiHeaders();
      } else {
        config.auth = this.getTrackingAuth();
      }

      return axios($ || this, config);
    },
    alias(args = {}) {
      return this.makeRequest({
        api: constants.API.TRACKING,
        method: "post",
        path: "/alias",
        ...args,
      });
    },
    group(args = {}) {
      return this.makeRequest({
        api: constants.API.TRACKING,
        method: "post",
        path: "/group",
        ...args,
      });
    },
    identify(args = {}) {
      return this.makeRequest({
        api: constants.API.TRACKING,
        method: "post",
        path: "/identify",
        ...args,
      });
    },
    page(args = {}) {
      return this.makeRequest({
        api: constants.API.TRACKING,
        method: "post",
        path: "/page",
        ...args,
      });
    },
    screen(args = {}) {
      return this.makeRequest({
        api: constants.API.TRACKING,
        method: "post",
        path: "/screen",
        ...args,
      });
    },
    track(args = {}) {
      return this.makeRequest({
        api: constants.API.TRACKING,
        method: "post",
        path: "/track",
        ...args,
      });
    },
    listWorkspaces(args = {}) {
      return this.makeRequest({
        path: "/",
        ...args,
      });
    },
    createDestination(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/destinations",
        ...args,
      });
    },
    createDestinationSubscription({
      destination, ...args
    }) {
      return this.makeRequest({
        method: "post",
        path: `/destinations/${destination}/subscriptions/`,
        ...args,
      });
    },
    deleteDestination({
      destination, ...args
    }) {
      return this.makeRequest({
        method: "delete",
        path: `/destinations/${destination}`,
        ...args,
      });
    },
    deleteDestinationSubscription({
      destination, subscription, ...args
    }) {
      return this.makeRequest({
        method: "delete",
        path: `/destinations/${destination}/subscriptions/${subscription}`,
        ...args,
      });
    },
    getDestination({
      destination, ...args
    }) {
      return this.makeRequest({
        path: `/destinations/${destination}`,
        ...args,
      });
    },
    getDestinationsCatalog(args = {}) {
      return this.makeRequest({
        path: "/catalog/destinations/",
        ...args,
      });
    },
    getDestinationMetadata({
      destinationMetadataId, ...args
    }) {
      return this.makeRequest({
        path: `/catalog/destinations/${destinationMetadataId}`,
        ...args,
      });
    },
    listSources(args = {}) {
      return this.makeRequest({
        path: "/sources",
        ...args,
      });
    },
  },
};
