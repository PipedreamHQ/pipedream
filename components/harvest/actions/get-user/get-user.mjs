import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-get-user",
  name: "Get User",
  description: "Retrieve a single user by ID. Use **List Users** to find a valid ID. To fetch the authenticated user, use **Get Me** instead. Example: call with userId set to a known user's ID to see their name, email, and role. [See the documentation](https://help.getharvest.com/api-v2/users-api/users/users/#retrieve-a-user).",
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
    userId: {
      propDefinition: [
        harvest,
        "userId",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.harvest.getUser({
      $,
      userId: this.userId,
      accountId: this.accountId,
    });
    $.export("$summary", `Successfully retrieved user ${response.id}: ${response.first_name} ${response.last_name}`);
    return response;
  },
};
