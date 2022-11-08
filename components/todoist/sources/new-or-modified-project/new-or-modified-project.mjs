import common from "../common-project.mjs";

export default {
  ...common,
  key: "todoist-new-or-modified-project",
  name: "New or Modified Project",
  description: "Emit new event for each new or modified project. [See the docs here](https://developer.todoist.com/sync/v8/#read-resources)",
  version: "0.0.3",
  type: "source",
};
