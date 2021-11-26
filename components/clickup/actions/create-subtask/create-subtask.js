const clickup = require("../../clickup.app.js");
const {
  props,
  run,
} = require("../create-task/create-task.js");

module.exports = {
  key: "clickup-create-subtask",
  name: "Create Subtask",
  description: "Creates a new subtask",
  version: "0.0.2",
  type: "action",
  props: {
    ...props,
    parent: {
      propDefinition: [
        clickup,
        "parent",
        (c) => ({
          list: c.list,
        }),
      ],
    },
  },
  run,
};
