import common from "../common-task.mjs";

export default {
  ...common,
  key: "todoist-new-or-modified-task",
  name: "New or Modified Task",
  description: "Emit new event for each new or modified task",
  version: "0.0.2",
  type: "source",
};
