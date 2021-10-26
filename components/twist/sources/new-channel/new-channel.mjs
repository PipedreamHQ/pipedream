import common from "../common.mjs";

export default {
  ...common,
  name: "New Channel (Instant)",
  version: "0.0.2",
  type: "source",
  key: "twist-new-channel",
  description: "Emits an event for any new channel added in a workspace",
  methods: {
    ...common.methods,
    getHookActivationData() {
      return {
        target_url: this.http.endpoint,
        event: "channel_added",
        workspace_id: this.workspace,
      };
    },
    getMeta(body) {
      const {
        id,
        name,
        created_ts: created,
      } = body;
      return {
        id,
        summary: name,
        ts: Date.parse(created),
      };
    },
  },
};
