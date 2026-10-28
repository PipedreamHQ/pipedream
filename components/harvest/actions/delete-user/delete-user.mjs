import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-delete-user",
  name: "Delete User",
  description: "Permanently delete a user (only possible if they have no time entries or expenses). Use **List Users** to find a valid ID. Example: call with userId set to a departed team member's ID to remove their Harvest access. [See the documentation](https://help.getharvest.com/api-v2/users-api/users/users/#delete-a-user).",
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
    userId: {
      propDefinition: [
        harvest,
        "userId",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    await this.harvest.deleteUser({
      $,
      userId: this.userId,
      accountId: this.accountId,
    });
    $.export("$summary", `Successfully deleted user ${this.userId}`);
  },
};
