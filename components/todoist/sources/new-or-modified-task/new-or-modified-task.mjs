import common from "../common-task.mjs";

export default {
  ...common,
  key: "todoist-new-or-modified-task",
  name: "New or Modified Task",
  description: "Emit new event for each new or modified task. [See the docs here](https://developer.todoist.com/sync/v8/#read-resources)",
  version: "0.0.3",
  type: "source",
};
