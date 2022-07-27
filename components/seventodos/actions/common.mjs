import options from "../options.mjs";

export default {
  props: {
    title: {
      type: "string",
      label: "Title",
      description: "The title of the task",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the task",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start date",
      description: "The starting date of the task, format: yyyy-mm-dd",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due date",
      description: "The due date of the task, format: yyyy-mm-dd",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the task",
      options: options.statusOpts,
      optional: true,
    },
    complexity: {
      type: "integer",
      label: "Complexity",
      description: "The complexity of the task",
      options: options.complexityOpts,
      optional: true,
    },
  },
};
