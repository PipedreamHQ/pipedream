import common from "../common/common.mjs";

export default {
  ...common,
  key: "zenkit-new-entry",
  name: "New Entry (Instant)",
  description: "Emit new event when a new item/entry is created in Zenkit",
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
    },
  },
  methods: {
    ...common.methods,
    async getHistoricalEvents(data) {
      return this.zenkit.listListEntries({
        listId: this.listId,
        data,
      });
    },
    getTriggerType() {
      return "entry";
    },
    getWebhookParams() {
      return {
        workspaceId: this.workspaceId,
        listId: this.listId,
      };
    },
    generateMeta(entry) {
      return {
        id: entry.id,
        summary: entry.displayString,
        ts: Date.parse(entry.created_at),
      };
    },
  },
};
