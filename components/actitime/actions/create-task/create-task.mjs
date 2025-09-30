import { ConfigurationError } from "@pipedream/platform";
import app from "../../actitime.app.mjs";

export default {
  key: "actitime-create-task",
  name: "Create Task",
  description: "Creates a new task. [See the documentation](https://online.actitime.com/pipedream/api/v1/swagger).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the task.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Details about the task.",
      optional: true,
    },
    typeOfWorkId: {
      propDefinition: [
        app,
        "typeOfWorkId",
      ],
    },
    deadline: {
      type: "string",
      label: "Deadline",
      description: "The deadline for the task. Eg. `2024-12-31`.",
      optional: true,
    },
    estimatedTime: {
      type: "integer",
      label: "Estimated Time",
      description: "The estimated time for the task in minutes.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the task. This field is mutually exclusive with **Workflow Status ID**.",
      optional: true,
      options: [
        "open",
        "completed",
      ],
    },
    workflowStatusId: {
      description: "The ID of the workflow status. This field is mutually exclusive with **Status**.",
      propDefinition: [
        app,
        "workflowStatusId",
      ],
    },
  },
  methods: {
    createTask(args = {}) {
      return this.app.post({
        path: "/tasks",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createTask,
      name,
      description,
      status,
      workflowStatusId,
      typeOfWorkId,
      deadline,
      estimatedTime,
      projectId,
    } = this;

    if (status && workflowStatusId) {
      throw new ConfigurationError("The **Status** and **Workflow Status ID** fields are mutually exclusive. Please provide only one of them.");
    }

    const response = await createTask({
      $,
      data: {
        name,
        description,
        status,
        workflowStatusId,
        typeOfWorkId,
        deadline,
        estimatedTime,
        projectId,
      },
    });

    $.export("$summary", `Successfully created task with ID \`${response.id}\`.`);
    return response;
  },
};
