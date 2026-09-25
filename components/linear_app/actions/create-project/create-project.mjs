import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-create-project",
  name: "Create Project",
  description: "Create a new project in Linear to track a body of work. Projects group related issues within a team. Use **Get Teams** for team IDs, **List Project Statuses** to find status IDs, **List Users** for member IDs, and **List Project Labels** for label IDs. Example: `teamId: \"9d1c3f7e-...\"`, `projectName: \"Mobile App v2\"`, `statusId: \"s2abc\"` → returns `{success: true, project: {id: \"proj_01\", name: \"Mobile App v2\"}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/inputs/ProjectCreateInput).",
  type: "action",
  ai: "optimized",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    linearApp,
    teamId: {
      propDefinition: [
        linearApp,
        "teamId",
      ],
    },
    projectName: {
      type: "string",
      label: "Name",
      description: "The name of the project. Example: `Mobile App v2`.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the project",
      optional: true,
    },
    statusId: {
      propDefinition: [
        linearApp,
        "projectStatusId",
      ],
    },
    priority: {
      propDefinition: [
        linearApp,
        "projectPriority",
      ],
    },
    memberIds: {
      propDefinition: [
        linearApp,
        "assigneeId",
      ],
      type: "string[]",
      label: "Member IDs",
      description: "The IDs of the members of the project",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the project in ISO 8601 format",
      optional: true,
    },
    targetDate: {
      type: "string",
      label: "Target Date",
      description: "The target date of the project in ISO 8601 format",
      optional: true,
    },
    labelIds: {
      propDefinition: [
        linearApp,
        "projectLabelIds",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.linearApp.client().createProject({
      teamIds: [
        this.teamId,
      ],
      name: this.projectName,
      description: this.description,
      statusId: this.statusId,
      priority: this.priority,
      memberIds: this.memberIds,
      startDate: this.startDate,
      targetDate: this.targetDate,
      labelIds: this.labelIds,
    });

    $.export("$summary", `Successfully created project with ID ${response._project.id}`);

    return response;
  },
};
