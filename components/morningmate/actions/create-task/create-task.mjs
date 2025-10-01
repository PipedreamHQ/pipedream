import morningmate from "../../morningmate.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "morningmate-create-task",
  name: "Create Task",
  description: "Creates a new task on a specific project. [See the documentation](https://api.morningmate.com/docs/api/posts#createTask-metadata)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    morningmate,
    projectId: {
      propDefinition: [
        morningmate,
        "projectId",
      ],
    },
    registerId: {
      propDefinition: [
        morningmate,
        "userId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the task",
    },
    contents: {
      type: "string",
      label: "Contents",
      description: "Content of the task",
    },
    status: {
      type: "string",
      label: "Status",
      description: "The task status",
      options: constants.STATUS,
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The task priority",
      options: constants.PRIORITY,
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date of the task in ISO 8601 format",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End date of the task in ISO 8601 format",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.morningmate.createTask({
      $,
      projectId: this.projectId,
      data: {
        registerId: this.registerId,
        title: this.title,
        contents: this.contents,
        status: this.status,
        priority: this.priority,
        startDate: this.startDate
          ? utils.formatDate(this.startDate)
          : undefined,
        endDate: this.endDate
          ? utils.formatDate(this.endDate)
          : undefined,
      },
    });
    $.export("$summary", `Successfully created task ${this.title}`);
    return response;
  },
};
