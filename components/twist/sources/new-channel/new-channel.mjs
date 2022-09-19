import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Channel (Instant)",
  version: "0.0.2",
  type: "source",
  key: "twist-new-channel-instant",
  description: "Emit new event for any new channel added in a workspace [See the docs here](https://developer.twist.com/v3/#outgoing-webhook)",
  methods: {
    ...common.methods,
    async getHistoricalEvents() {
      return this.twist.getChannels({
        workspace: this.workspace,
      });
    },
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
