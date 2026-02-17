import common from "../common-task.mjs";

export default {
  ...common,
  key: "todoist-new-task",
  name: "New Task",
  description: "Emit new event for each new task. [See the documentation](https://developer.todoist.com/api/v1#tag/Sync/Overview/Read-resources)",
  version: "0.0.7",
  type: "source",
  dedupe: "greatest",
};
