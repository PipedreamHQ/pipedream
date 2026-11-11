import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-create-user-assignment",
  name: "Create User Assignment",
  description: "Assign a user to a project. Use **Get Projects** to find a project ID, and **List Users** to find user IDs. Example: call with projectId and userId set to staff that person on the project. [See the documentation](https://help.getharvest.com/api-v2/projects-api/projects/user-assignments/#create-a-user-assignment).",
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
    userId: {
      propDefinition: [
        harvest,
        "userId",
      ],
      optional: false,
    },
    isActive: {
      propDefinition: [
        harvest,
        "isActive",
      ],
      description: "Whether the user assignment is active.",
    },
    isProjectManager: {
      propDefinition: [
        harvest,
        "isProjectManager",
      ],
    },
    useDefaultRates: {
      propDefinition: [
        harvest,
        "useDefaultRates",
      ],
    },
    hourlyRate: {
      propDefinition: [
        harvest,
        "userAssignmentHourlyRate",
      ],
    },
    budget: {
      propDefinition: [
        harvest,
        "userAssignmentBudget",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.harvest.createUserAssignment({
      $,
      projectId: this.projectId,
      accountId: this.accountId,
      data: {
        user_id: this.userId,
        is_active: this.isActive,
        is_project_manager: this.isProjectManager,
        use_default_rates: this.useDefaultRates,
        hourly_rate: this.hourlyRate,
        budget: this.budget,
      },
    });
    $.export("$summary", `Successfully created user assignment ${response.id}`);
    return response;
  },
};
