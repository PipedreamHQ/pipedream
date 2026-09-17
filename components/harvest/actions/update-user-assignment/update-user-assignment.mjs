import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-update-user-assignment",
  name: "Update User Assignment",
  description: "Update a user assignment on a project. Use **List User Assignments** to find IDs. Example: call with projectId, userAssignmentId, and hourlyRate=\"150\" to set that person's custom billing rate on the project. [See the documentation](https://help.getharvest.com/api-v2/projects-api/projects/user-assignments/#update-a-user-assignment).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    harvest,
    accountId: {
      propDefinition: [
        harvest,
        "accountId",
      ],
    },
    projectId: {
      propDefinition: [
        harvest,
        "projectId",
      ],
    },
    userAssignmentId: {
      propDefinition: [
        harvest,
        "userAssignmentId",
      ],
    },
    isActive: {
      propDefinition: [
        harvest,
        "isActive",
      ],
      description: "Whether the user assignment is active.",
    },
    isProjectManager: {
      type: "boolean",
      label: "Is Project Manager",
      description: "Whether the user is a project manager.",
      optional: true,
    },
    useDefaultRates: {
      type: "boolean",
      label: "Use Default Rates",
      description: "Whether to use the user's default rate.",
      optional: true,
    },
    hourlyRate: {
      type: "string",
      label: "Hourly Rate",
      description: "Custom hourly rate, decimal.",
      optional: true,
    },
    budget: {
      type: "string",
      label: "Budget",
      description: "Budget, decimal.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.harvest.updateUserAssignment({
      $,
      projectId: this.projectId,
      userAssignmentId: this.userAssignmentId,
      accountId: this.accountId,
      data: {
        is_active: this.isActive,
        is_project_manager: this.isProjectManager,
        use_default_rates: this.useDefaultRates,
        hourly_rate: this.hourlyRate,
        budget: this.budget,
      },
    });
    $.export("$summary", `Successfully updated user assignment ${response.id}`);
    return response;
  },
};
