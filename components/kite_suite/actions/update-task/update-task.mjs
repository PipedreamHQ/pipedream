import kiteSuite from "../../kite_suite.app.mjs";

export default {
  key: "kite_suite-update-task",
  name: "Update Task",
  description: "Update an existing task in a project. [See the documentation](https://api.kitesuite.com/swagger/#/Task/patch_api_v1_task__id_).",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    kiteSuite,
    workspace: {
      propDefinition: [
        kiteSuite,
        "workspace",
      ],
    },
    projectId: {
      propDefinition: [
        kiteSuite,
        "projectId",
        (c) => ({
          workspace: c.workspace,
        }),
      ],
    },
    taskId: {
      propDefinition: [
        kiteSuite,
        "taskId",
        (c) => ({
          workspace: c.workspace,
          projectId: c.projectId,
        }),
      ],
    },
    summary: {
      propDefinition: [
        kiteSuite,
        "summary",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        kiteSuite,
        "description",
      ],
    },
    issueType: {
      propDefinition: [
        kiteSuite,
        "issueType",
      ],
    },
    assigneeId: {
      propDefinition: [
        kiteSuite,
        "userId",
        (c) => ({
          workspace: c.workspace,
        }),
      ],
    },
    sprintId: {
      propDefinition: [
        kiteSuite,
        "sprintId",
        (c) => ({
          workspace: c.workspace,
          projectId: c.projectId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const data = {
      issueType: this.issueType,
      summary: this.summary,
      description: this.description,
      assigneeID: this.assigneeId,
      sprint: this.sprintId,
    };

    const response = await this.kiteSuite.updateTask({
      workspace: this.workspace,
      taskId: this.taskId,
      data,
      $,
    });

    if (response.data._id) {
      $.export("$summary", `Successfully updated task with ID ${response.data._id}.`);
    }

    return response;
  },
};
