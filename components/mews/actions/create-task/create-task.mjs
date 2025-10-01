import app from "../../mews.app.mjs";

export default {
  name: "Create New Task",
  description: "Create a new task in Mews. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/tasks#add-task)",
  key: "mews-create-task",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "Name (or title) of the task.",
    },
    deadlineUtc: {
      type: "string",
      label: "Deadline (UTC)",
      description: "Deadline of the task in UTC timezone in ISO 8601 format.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the task.",
      optional: true,
    },
    departmentId: {
      propDefinition: [
        app,
        "departmentId",
      ],
      description: "Unique identifier of the Department the task is addressed to.",
    },
    serviceOrderId: {
      propDefinition: [
        app,
        "productServiceOrderId",
      ],
      description: "Unique identifier of the Service the task is related to.",
    },
  },
  async run({ $ }) {
    const {
      app,
      name,
      description,
      departmentId,
      serviceOrderId,
      deadlineUtc,
    } = this;

    const response = await app.tasksCreate({
      $,
      data: {
        Name: name,
        Description: description,
        DepartmentId: departmentId,
        ServiceOrderId: serviceOrderId,
        DeadlineUtc: deadlineUtc,
      },
    });

    $.export("$summary", "Successfully created task");
    return response;
  },
};
