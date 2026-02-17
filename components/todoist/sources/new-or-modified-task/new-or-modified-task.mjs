import common from "../common-task.mjs";

export default {
  ...common,
  key: "todoist-new-or-modified-task",
  name: "New or Modified Task",
  description: "Emit new event for each new or modified task. [See the documentation](https://developer.todoist.com/api/v1#tag/Sync/Overview/Read-resources)",
  version: "0.0.7",
  type: "source",
};
