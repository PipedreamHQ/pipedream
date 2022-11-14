import base from "../common/base.mjs";

export default {
  key: "splitwise-group-created",
  name: "Group Created",
  description: "Emit new event for every group created. [See docs here](https://dev.splitwise.com/#tag/groups/paths/~1get_groups/get)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: base.props,
  methods: base.methods,
  async run() {
    console.log("Retrieving groups...");

    const groups = (await this.splitwise.getGroups()).filter(({ id }) => id !== 0);
    this.logEmitEvent(groups);

    for (const group of groups) {
      this.$emit(group, {
        id: group.id,
        summary: `New group: ${group.name}`,
        ts: Date.parse(group.created_at),
      });
    }
  },
};
