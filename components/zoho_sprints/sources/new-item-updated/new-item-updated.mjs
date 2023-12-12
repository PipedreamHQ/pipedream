import common from "../common/base.mjs";

export default {
  ...common,
  key: "zoho_sprints-new-item-updated",
  name: "New Item Updated (Instant)",
  description: "Emit new event when an existing item in Zoho Sprints is modified.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getModule() {
      return "3"; // 3 = Item
    },
    getEventType() {
      return "item_update";
    },
    getKeyValParams() {
      return [
        {
          key: "itemId",
          val: "${Item.ItemId}",
        },
        {
          key: "sprintId",
          val: "${Sprint.SprintId}",
        },
        {
          key: "projectId",
          val: "${Project.ProjectId}",
        },
      ];
    },
    generateMeta() {
      return {
        id: Date.now(),
        summary: "Item Updated",
        ts: Date.now(),
      };
    },
  },
  async run(event) {
    const { query } = event;
    if (!query) {
      return;
    }
    const {
      itemId, sprintId, projectId,
    } = query;
    const item = await this.zohoSprints.getItem({
      teamId: this.teamId,
      projectId,
      sprintId,
      itemId,
      params: {
        action: "details",
      },
    });

    this.$emit(item, this.generateMeta());
  },
};
