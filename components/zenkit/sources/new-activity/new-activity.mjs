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
    workspaceId: {
      propDefinition: [
        common.props.zenkit,
        "workspaceId",
      ],
    },
    listId: {
      propDefinition: [
        common.props.zenkit,
        "listId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    async getHistoricalEvents(params) {
      return this.listId
        ? this.zenkit.listListActivities({
          listId: this.listId,
          params,
        })
        : this.zenkit.listWorkspaceActivities({
          workspaceId: this.workspaceId,
          params,
        });
    },
    getTriggerType() {
      return "activity";
    },
    getWebhookParams() {
      return {
        workspaceId: this.workspaceId,
        listId: this.listId,
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
