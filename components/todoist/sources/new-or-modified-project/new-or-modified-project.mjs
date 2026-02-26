import common from "../common-project.mjs";

export default {
  ...common,
  key: "todoist-new-or-modified-project",
  name: "New or Modified Project",
  description: "Emit new event for each new or modified project. [See the documentation](https://developer.todoist.com/api/v1#tag/Sync/Overview/Read-resources)",
  version: "0.0.9",
  type: "source",
};
