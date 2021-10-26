import common from "../common.mjs";

export default {
  ...common,
  name: "New Group (Instant)",
  version: "0.0.1",
  type: "source",
  key: "twist-new-group-instant",
  description: "Emits an event for any new group added in a workspace",
  methods: {
    ...common.methods,
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
