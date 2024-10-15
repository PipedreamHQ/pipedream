import everhour from "../../everhour.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "everhour-create-task",
  name: "Create Task",
  description: "Creates a new task in Everhour. [See the documentation](https://everhour.docs.apiary.io/)",
  version: "0.0.1",
  type: "action",
  props: {
    everhour,
    projectId: {
      propDefinition: [
        everhour,
        "projectId",
      ],
    },
    name: {
      type: "string",
      label: "Task Name",
      description: "The name of the task to be created",
      optional: true,
    },
    section: {
      type: "string",
      label: "Section",
      description: "The section of the task",
      optional: true,
    },
    labels: {
      type: "string[]",
      label: "Labels",
      description: "An array of labels associated with the task",
      optional: true,
    },
    position: {
      type: "integer",
      label: "Position",
      description: "The position of the task",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the task",
      optional: true,
    },
    dueon: {
      type: "string",
      label: "Due Date",
      description: "The due date of the task (ISO 8601 format)",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the task",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.everhour.createTask({
      projectId: this.projectId,
      name: this.name,
      section: this.section,
      labels: this.labels,
      position: this.position,
      description: this.description,
      dueon: this.dueon,
      status: this.status,
    });

    $.export("$summary", `Successfully created task with ID: ${response.id}`);
    return response;
  },
};
