import streak from "../../streak.app.mjs";

const docLink = "https://streak.readme.io/reference/create-a-task";

export default {
  key: "streak-create-task",
  name: "Create Task",
  description: `Create a new task in a box. [See the docs](${docLink})`,
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    streak,
    pipelineId: {
      propDefinition: [
        streak,
        "pipelineId",
      ],
    },
    boxId: {
      propDefinition: [
        streak,
        "boxId",
        (c) => ({
          pipelineId: c.pipelineId,
        }),
      ],
    },
    text: {
      type: "string",
      label: "Text",
      description: "Task description",
    },
    dueDate: {
      type: "integer",
      label: "Due Date",
      description: "Due date in Unix milliseconds timestamp",
      optional: true,
    },
    assignees: {
      propDefinition: [
        streak,
        "teamMembers",
        (c) => ({
          teamId: c.teamId,
        }),
      ],
      description: "The member(s) of your team this box will be assigned to",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.streak.createTask({
      $,
      boxId: this.boxId,
      data: {
        text: this.text,
        dueDate: this.dueDate,
        assignedToSharingEntries: this.assignees?.map((assignee) => ({
          email: assignee,
        })),
      },
    });
    $.export("$summary", "Successfully created task");
    return response;
  },
};
