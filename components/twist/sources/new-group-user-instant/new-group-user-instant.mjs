import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Group User (Instant)",
  version: "0.0.2",
  type: "source",
  key: "twist-new-group-user-instant",
  description: "Emit new event for any new user added to a workspace group [See the docs here](https://developer.twist.com/v3/#outgoing-webhook)",
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
        event: "group_user_added",
        workspace_id: this.workspace,
      };
    },
    getMeta(body) {
      const {
        id,
        name,
        user_ids: userIds,
      } = body;
      return {
        id: `${id}${userIds}`,
        summary: name,
        ts: Date.now(),
      };
    },
  },
};
