import common from "../common-project.mjs";

export default {
  ...common,
  key: "todoist-new-project",
  name: "New Project",
  description: "Emit new event for each new project",
  version: "0.0.2",
  type: "source",
  dedupe: "greatest",
};
