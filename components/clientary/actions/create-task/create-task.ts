import { defineAction } from "@pipedream/types";
import app from "../../app/clientary.app";

export default defineAction({
  key: "clientary-create-task",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Create Task",
  description: "Creates a new task. [See docs here](https://www.clientary.com/api/tasks)",
  type: "action",
  props: {
    app,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the task",
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date of the task, e.g. `2022/11/17`",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Task description",
      optional: true,
    },
    assignee: {
      propDefinition: [
        app,
        "assigneeId",
      ],
      description: "Assignee ID whom given the task",
      optional: true,
    },
    project: {
      propDefinition: [
        app,
        "projectId",
      ],
      description: "Project ID related to the task",
      optional: true,
    },
    client: {
      propDefinition: [
        app,
        "clientId",
      ],
      description: "Client ID related to the task",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.getRequestMethod("createTask")({
      $,
      data: {
        title: this.title,
        due_date: this.dueDate,
        description: this.description,
        assignee_id: this.assignee,
        project_id: this.project,
        client_id: this.client,
      },
    });
    $.export("$summary", `Successfully created a task (ID: ${response.id})`);
    return response;
  },
});
