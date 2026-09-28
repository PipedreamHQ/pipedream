import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-get-me",
  name: "Get Me",
  description: "Retrieve the currently authenticated user from `GET /users/me`. Takes no ID input. Example: call with no parameters to answer \"who am I logged in as in Harvest?\". [See the documentation](https://help.getharvest.com/api-v2/users-api/users/users/#retrieve-the-currently-authenticated-user).",
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
  },
  async run({ $ }) {
    const response = await this.harvest.getMe({
      $,
      accountId: this.accountId,
    });
    $.export("$summary", `Successfully retrieved authenticated user ${response.id}: ${response.first_name} ${response.last_name}`);
    return response;
  },
};
