const twist = require("../../twist.app.js");
const common = require("../common.js");

module.exports = {
  ...common,
  name: "New Channel (Instant)",
  version: "0.0.1",
  key: "twist-new-channel",
  description: "Emits an event for any new channel added in a workspace",
  methods: {
    getHookActivationData() {
      return {
        target_url: this.http.endpoint,
        event: "channel_added",
        workspace_id: this.workspace,
      };
    },
    getMeta(body) {
      const { id, name, created_ts } = body;
      return {
        id,
        summary: name,
        ts: Date.parse(created_ts),
      };
    },
  },
};