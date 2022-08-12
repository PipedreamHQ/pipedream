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
    },
  },
  methods: {
    ...common.methods,
    async getHistoricalEvents(data) {
      return this.zenkit.listListEntries({
        listId: this.list,
        data,
      });
    },
    getTriggerType() {
      return "entry";
    },
    getWebhookParams() {
      return {
        workspaceId: this.workspace,
        listId: this.list,
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
