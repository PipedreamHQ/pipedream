/* eslint-disable camelcase */
import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "pipedream",
  propDefinitions: {
    componentKey: {
      type: "string",
      label: "Component Key",
      description: "The component key (identified by the key property within the component's source code) you'd like to fetch metadata for (example: `github-new-commit-instant`)",
    },
    subscriptionSource: {
      type: "string",
      label: "Subscription source",
      description: `Subscription source. Organisation ID or user ID is set as the emitter_id,
      [See details here](https://pipedream.com/docs/api/rest/#listen-for-events-from-another-source-or-workflow)`,
      async options({ subscriptionCategory }) {
        const { data } = await this.getCurrentUserInfo();
        if (subscriptionCategory === "Organisation") {
          return  data.orgs.map((org) => ({
            label: `Org - ${org.orgname}`,
            value: org.id,
          }));
        } else if (subscriptionCategory === "User") {
          return [
            {
              label: `User - ${data.username}`,
              value: data.id,
            },
          ];
        }
        return [
          {
            label: "Listen to events from all workflows",
            value: "p_*",
          },
          {
            label: "Listen to events from all event sources",
            value: "dc_*",
          },
        ];
      },
    },
    subscriptionCategory: {
      type: "string",
      label: "Subscription category",
      description: "Set user or organisation as subscription source",
      options: constants.SUBSCRIPTION_SOURCE,
    },
    listenerId: {
      type: "string",
      label: "Listener ID",
      description: "The ID of the component or workflow you'd like to receive events",
    },
    eventName: {
      type: "string",
      label: "Event name",
      description: "The name of the event stream tied to your subscription. Only pass event_name when you're listening for events on a custom channel, with the name of the custom channel",
      optional: true,
      options: constants.SUBSCRIPTION_EVENTS,
    },
    appId: {
      type: "string",
      label: "App ID",
      description: "The ID or name slug of the app you'd like to retrieve (e.g., `app_OkrhR1` or `slack`)",
      useQuery: true,
      async options({
        query,
        mapper = ({
          id: value, name: label,
        }) => ({
          value,
          label,
        }),
      }) {
        const response = await this.listApps({
          params: {
            q: query,
          },
        });
        return response.data.map(mapper);
      },
    },
    query: {
      type: "string",
      label: "Query",
      description: "The query string to search for components in the global registry, e.g. `Send a message to Slack on new Hubspot contacts`",
    },
    similarityThreshold: {
      type: "string",
      label: "Similarity Threshold",
      description: "Optional minimum match score between 0 and 1, calculated via cosine distance between query and component embeddings",
      optional: true,
    },
    debug: {
      type: "boolean",
      label: "Debug",
      description: "Optional flag to return additional diagnostic data",
      optional: true,
    },
    hasComponents: {
      type: "boolean",
      label: "Has Components",
      description: "Show only apps with public triggers or actions",
      optional: true,
    },
    hasActions: {
      type: "boolean",
      label: "Has Actions",
      description: "Display only apps offering public actions",
      optional: true,
    },
    hasTriggers: {
      type: "boolean",
      label: "Has Triggers",
      description: "Display only apps offering public triggers",
      optional: true,
    },
    q: {
      type: "string",
      label: "Query",
      description: "Filter apps by name (e.g., `Slack`)",
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      return `https://api.pipedream.com/v1${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
        "user-agent": "@PipedreamHQ/pipedream v0.1",
      };
    },
    _makeAPIRequest({
      $ = this, path, headers, ...opts
    } = {}) {
      return axios($, {
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
        ...opts,
      });
    },
    getComponent({
      key, globalRegistry, ...args
    } = {}) {
      const suffix = globalRegistry
        ? "registry/"
        : "";
      return this._makeAPIRequest({
        path: `/components/${suffix}${key}`,
        ...args,
      });
    },
    async subscribe(emitter_id, listener_id, event_name = null) {
      let params = {
        emitter_id,
        listener_id,
      };
      if (event_name) {
        params.event_name = event_name;
      }
      return await this._makeAPIRequest({
        method: "POST",
        path: "/subscriptions",
        params,
      });
    },
    async listEvents(dcID, event_name) {
      return await this._makeAPIRequest({
        path: `/sources/${dcID}/event_summaries`,
        params: {
          event_name,
        },
      });
    },
    async getCurrentUserInfo(args = {}) {
      return await this._makeAPIRequest({
        path: "/users/me",
        ...args,
      });
    },
    async deleteEvent(dcID, eventID, event_name) {
      return await this._makeAPIRequest({
        method: "DELETE",
        path: `/sources/${dcID}/events`,
        params: {
          start_id: eventID,
          end_id: eventID,
          event_name,
        },
      });
    },
    async deleteSubscription(emitter_id, listener_id, event_name) {
      let params = {
        emitter_id,
        listener_id,
        event_name,
      };
      return await this._makeAPIRequest({
        method: "DELETE",
        path: "/subscriptions",
        params,
      });
    },
    listApps(args = {}) {
      return this._makeAPIRequest({
        path: "/apps",
        ...args,
      });
    },
    getApp({
      appId, ...args
    } = {}) {
      return this._makeAPIRequest({
        path: `/apps/${appId}`,
        ...args,
      });
    },
    getComponentFromRegistry({
      key, ...args
    } = {}) {
      return this._makeAPIRequest({
        path: `/components/registry/${key}`,
        ...args,
      });
    },
    searchComponents(args = {}) {
      return this._makeAPIRequest({
        path: "/components/search",
        ...args,
      });
    },
  },
};
