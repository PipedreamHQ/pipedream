const common = require("../common-project.js");

module.exports = {
  ...common,
  key: "todoist-new-or-modified-project",
  name: "New or Modified Project",
  description: "Emit an event for each new or modified project",
  version: "0.0.1",
};
