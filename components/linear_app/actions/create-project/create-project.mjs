import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-create-project",
  name: "Create Project",
  description: "Create a project in Linear. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/inputs/ProjectCreateInput).",
  type: "action",
  version: "0.0.1",
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
    name: {
      type: "string",
      label: "Name",
      description: "The name of the project",
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
      name: this.name,
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
