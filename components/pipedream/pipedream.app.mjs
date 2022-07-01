/* eslint-disable camelcase */
import axios from "axios";

export default {
  type: "app",
  app: "pipedream",
  propDefinitions: {
    emitterId: {
      type: "string",
      label: "Emitter ID",
      description: "The ID of the workflow or component emitting events",
      async options() {
        const { data } = await this.getCurrentUserInfo();
        return data.orgs.map((org) => ({
          label: `User: ${data.username} - Org: ${org.orgname} `,
          value: org.id,
        }));
      },
    },
    listenerId: {
      type: "string",
      label: "Listener ID",
      description: "The ID of the component or workflow you'd like to receive events",
    },
    eventName: {
      type: "string",
      label: "Event name",
      description: "The name of the event stream tied to your subscription",
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
    async subscribe(emitter_id, listener_id, event_name) {
      let params = {
        emitter_id,
        listener_id,
        event_name,
      };
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
