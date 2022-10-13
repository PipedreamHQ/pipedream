import splitwise from "../../splitwise.app.mjs";

export default {
  key: "splitwise-group-created",
  name: "Group Created",
  description: "Emit new event for every group created. [See docs here](https://dev.splitwise.com/#tag/groups/paths/~1get_groups/get)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    splitwise,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  async run() {
    const groups = await this.splitwise.getGroups();
    for (const group of groups) {
      if (group.id !== 0) {
        this.$emit(group, {
          id: group.id,
          summary: `New group: ${group.name}`,
          ts: Date.parse(group.created_at),
        });
      }
    }
  },
};
