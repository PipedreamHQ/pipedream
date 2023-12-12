import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "microsofttodo-new-list-created",
  name: "New List Created",
  description: "Emit new event when a new task list is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    generateMeta(list) {
      return {
        id: list.id.slice(-64),
        summary: list.displayName,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const { value } = await this.microsoftTodo.listLists();
    for (const list of value) {
      const meta = this.generateMeta(list);
      this.$emit(list, meta);
    }
  },
};
