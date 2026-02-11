import common from "../common-task.mjs";

export default {
  ...common,
  key: "todoist-incomplete-task",
  name: "New Incomplete Task",
  description: "Emit new event for each new incomplete task. [See the documentation](https://developer.todoist.com/api/v1#tag/Sync/Overview/Read-resources)",
  version: "0.1.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    onlyRootTasks: {
      type: "boolean",
      label: "Only Root Tasks",
      description: "Only emit events for root tasks. If enabled, only tasks that have no parent will be emitted.",
      default: false,
    },
  },
  methods: {
    ...common.methods,
    isElementRelevant(element) {
      return !element.checked && (this.onlyRootTasks
        ? element.parent_id === null
        : true);
    },
  },
};
