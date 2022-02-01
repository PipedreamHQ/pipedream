import clickup from "../../clickup.app.mjs";
import createTask from "../create-task/create-task.mjs";

export default {
  ...createTask,
  key: "clickup-create-subtask",
  name: "Create Subtask",
  description: "Creates a new subtask",
  version: "0.0.3",
  type: "action",
  props: {
    ...createTask.props,
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
};
