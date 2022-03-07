/* eslint-disable camelcase */
import axios from "axios";

export default {
  type: "app",
  app: "pipedream",
  methods: {
    async _makeAPIRequest(opts) {
      if (!opts.headers) opts.headers = {};
      opts.headers["Authorization"] = `Bearer ${this.$auth.api_key}`;
      opts.headers["Content-Type"] = "application/json";
      opts.headers["user-agent"] = "@PipedreamHQ/pipedream v0.1";
      const { path } = opts;
      delete opts.path;
      opts.url = `https://api.pipedream.com/v1${
        path[0] === "/"
          ? ""
          : "/"
      }${path}`;
      return (await axios(opts)).data;
    },
    async subscribe(emitter_id, listener_id, channel) {
      let params = {
        emitter_id,
        listener_id,
      };
      if (channel) {
        params.event_name = channel;
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
  },
};
