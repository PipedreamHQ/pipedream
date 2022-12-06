/* eslint-disable camelcase */
import axios from "axios";
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
  },
  methods: {
    async _makeAPIRequest(opts) {
      if (!opts.headers) opts.headers = {};
      opts.headers["Authorization"] = `Bearer ${this.$auth.api_key}`;
      opts.headers["Content-Type"] = "application/json";
      opts.headers["user-agent"] = "@PipedreamHQ/pipedream v0.1";
      const { path } = opts;
      delete opts.path;
      opts.url = `https://api.pipedream.com/v1${path[0] === "/"
        ? ""
        : "/"
      }${path}`;
      return (await axios(opts)).data;
    },
    async getComponent(key, globalRegistry) {
      let path = "/components/";
      if (globalRegistry) path += "registry/";
      path += key;

      return this._makeAPIRequest({
        method: "GET",
        path,
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
  },
};
