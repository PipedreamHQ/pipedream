import common from "../common-task.mjs";

export default {
  ...common,
  key: "todoist-new-task",
  name: "New Task",
  description: "Emit new event for each new task. [See the docs here](https://developer.todoist.com/sync/v8/#read-resources)",
  version: "0.0.2",
  type: "source",
  dedupe: "greatest",
};
