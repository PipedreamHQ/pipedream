import app from "../../teamwork.app.mjs";

export default {
  type: "action",
  key: "teamwork-create-task",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Create Task",
  description: "Create a new task in the backlog. [See the docs here](https://apidocs.teamwork.com/docs/teamwork/cd8948166b1b1-create-a-task)",
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    tasklistId: {
      propDefinition: [
        app,
        "tasklistId",
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
  async run ({ $ }) {
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
    await this.app.createTask(
      this.tasklistId,
      data,
      $,
    );
    $.export("$summary", "Task successfully created");
  },
};
