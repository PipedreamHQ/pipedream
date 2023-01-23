import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Group (Instant)",
  version: "0.0.2",
  type: "source",
  key: "twist-new-group-instant",
  description: "Emit new event for any new group added in a workspace [See the docs here](https://developer.twist.com/v3/#outgoing-webhook)",
  methods: {
    ...common.methods,
    async getHistoricalEvents() {
      return this.twist.getGroups({
        workspace: this.workspace,
      });
    },
    getHookActivationData() {
      return {
        target_url: this.http.endpoint,
        event: "group_added",
        workspace_id: this.workspace,
      };
    },
    getMeta(body) {
      const {
        id,
        name,
      } = body;
      return {
        id,
        summary: name,
        ts: Date.now(),
      };
    },
  },
};
