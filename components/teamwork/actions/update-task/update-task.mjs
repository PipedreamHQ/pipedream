import app from "../../teamwork.app.mjs";

export default {
  type: "action",
  key: "teamwork-update-task",
  name: "Update Task",
  description: "Update a task. [See the docs here](https://apidocs.teamwork.com/docs/teamwork/6e3da2c04d779-update-a-task)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    taskId: {
      propDefinition: [
        app,
        "taskId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
    content: {
      propDefinition: [
        app,
        "content",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    priority: {
      propDefinition: [
        app,
        "priority",
      ],
    },
    creatorId: {
      propDefinition: [
        app,
        "peopleId",
      ],
      label: "Creator Id",
      description: "The id of the person who created the task",
      optional: true,
    },
    responsiblePartyId: {
      propDefinition: [
        app,
        "peopleId",
      ],
      label: "Responsible Party Id",
      description: "The id of the person who is responsible for the task",
      optional: true,
    },
    columnId: {
      propDefinition: [
        app,
        "columnId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      optional: true,
    },
    startDate: {
      propDefinition: [
        app,
        "startDate",
      ],
    },
    dueDate: {
      propDefinition: [
        app,
        "dueDate",
      ],
    },
    useDefaults: {
      propDefinition: [
        app,
        "useDefaults",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      "content": this.content,
      "description": this.description,
      "creator-id": this.creatorId,
      "responsible-party-id": this.responsiblePartyId,
      "priority": this.priority,
      "columnId": this.columnId,
      "start-date": this.startDate,
      "due-date": this.dueDate,
      "use-defaults": this.useDefaults,
    };
    const res = await this.app.updateTask(
      this.taskId,
      data,
      $,
    );
    $.export("$summary", "Task successfully updated");
    return res;
  },
};
