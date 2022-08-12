import common from "../common/common.mjs";

export default {
  ...common,
  key: "zenkit-updated-entry",
  name: "Updated Entry (Instant)",
  description: "Emit new event when an entry is updated in Zenkit",
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
      const activities = this.list
        ? await this.zenkit.listListActivities({
          listId: this.list,
          params,
        })
        : await this.zenkit.listWorkspaceActivities({
          workspaceId: this.workspace,
          params,
        });
      if (!activities) {
        return;
      }
      // only return activities of type 2 - 'Resource was updated'
      return activities.filter((activity) => activity.type === 2);
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
        summary: `${activity.listEntryDisplayString} updated`,
        ts: Date.parse(activity.updated_at),
      };
    },
  },
  async run(event) {
    const { body } = event;
    for (const item of body) {
      if (item.type !== 2) {
        console.log("Not an update event. Skipping...");
        continue;
      }
      this.emitEvent(item);
    }
  },
};
