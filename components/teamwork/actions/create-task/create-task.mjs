import app from "../../teamwork.app.mjs";

export default {
  type: "action",
  key: "teamwork-create-task",
  version: "0.0.21",
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
      type: "string",
      label: "Content",
      description: "The content of the task",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the task",
      optional: true,
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The priority of the task",
      optional: true,
      options: [
        "Low",
        "Medium",
        "High",
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
      type: "string",
      label: "Start Date",
      description: "The date the task should start. `yyyymmdd`",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The date the task is due `yyyymmdd`",
      optional: true,
    },
    useDefaults: {
      type: "boolean",
      label: "Use Defaults",
      description: "Use the default values for the task",
      optional: true,
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
