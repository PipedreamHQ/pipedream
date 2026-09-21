import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-delete-user-assignment",
  name: "Delete User Assignment",
  description: "Delete a user assignment from a project (only possible if it has no time entries or expenses). Use **List User Assignments** to find IDs. Example: call with projectId and userAssignmentId to unstaff that person from the project. [See the documentation](https://help.getharvest.com/api-v2/projects-api/projects/user-assignments/#delete-a-user-assignment).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
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
  },
  async run({ $ }) {
    await this.harvest.deleteUserAssignment({
      $,
      projectId: this.projectId,
      userAssignmentId: this.userAssignmentId,
      accountId: this.accountId,
    });
    $.export("$summary", `Successfully deleted user assignment ${this.userAssignmentId}`);
  },
};
