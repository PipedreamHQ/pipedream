import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-get-user-assignment",
  name: "Get User Assignment",
  description: "Retrieve a single user assignment on a project. Use **List User Assignments** to find IDs. Example: call with projectId and userAssignmentId to check that person's hourly rate on the project. [See the documentation](https://help.getharvest.com/api-v2/projects-api/projects/user-assignments/#retrieve-a-user-assignment).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
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
  },
  async run({ $ }) {
    const response = await this.harvest.getUserAssignment({
      $,
      projectId: this.projectId,
      userAssignmentId: this.userAssignmentId,
      accountId: this.accountId,
    });
    $.export("$summary", `Successfully retrieved user assignment ${response.id}`);
    return response;
  },
};
