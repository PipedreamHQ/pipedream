import common from "../common-project.mjs";

export default {
  ...common,
  key: "todoist-new-project",
  name: "New Project",
  description: "Emit new event for each new project. [See the docs here](https://developer.todoist.com/sync/v8/#read-resources)",
  version: "0.0.6",
  type: "source",
  dedupe: "greatest",
};
