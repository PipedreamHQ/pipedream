import kiteSuite from "../../kite_suite.app.mjs";

export default {
  key: "kite_suite-create-task",
  name: "Create Task",
  description: "Create a new task in a project in Kite Suite. [See the documentation](https://api.kitesuite.com/swagger/#/Task/post_api_v1_task)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
    summary: {
      propDefinition: [
        kiteSuite,
        "summary",
      ],
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
      projectID: this.projectId,
      issueType: this.issueType,
      summary: this.summary,
      description: this.description,
      assigneeID: this.assigneeId,
      sprint: this.sprintId,
    };

    const response = await this.kiteSuite.createTask({
      workspace: this.workspace,
      data,
      $,
    });

    if (response.data._id) {
      $.export("$summary", `Successfully created new task with ID ${response.data._id}.`);
    }

    return response;
  },
};
