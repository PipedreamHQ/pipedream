const common = require("../common-project.js");

module.exports = {
  ...common,
  key: "todoist-new-project",
  name: "New Project",
  description: "Emit an event for each new project",
  version: "0.0.1",
  dedupe: "greatest",
};
