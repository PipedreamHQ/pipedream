import common from "../common/common.mjs";

export default {
  ...common,
  key: "zenkit-new-activity",
  name: "New Activity (Instant)",
  description: "Emit new event when there is new activity in Zenkit",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    workspace: {
      propDefinition: [
        common.props.zenkit,
        "workspace",
      ],
    },
    list: {
      propDefinition: [
        common.props.zenkit,
        "list",
        (c) => ({
          workspaceId: c.workspace,
        }),
      ],
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    async getHistoricalEvents(params) {
      return this.list
        ? this.zenkit.listListActivities({
          listId: this.list,
          params,
        })
        : this.zenkit.listWorkspaceActivities({
          workspaceId: this.workspace,
          params,
        });
    },
    getTriggerType() {
      return "activity";
    },
    getWebhookParams() {
      return {
        workspaceId: this.workspace,
        listId: this.list,
      };
    },
    generateMeta(activity) {
      return {
        id: activity.id,
        summary: `New Activity ${activity.id}`,
        ts: Date.parse(activity.updated_at),
      };
    },
  },
};
