import rydoo from "../../rydoo.app.mjs";

export default {
  key: "rydoo-get-user-details",
  name: "Get User Details",
  description: "Retrieves full profile information, roles, and modules for a specific user. [See the documentation](https://developers.rydoo.com/reference/v2usergetuser)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    rydoo,
    userId: {
      propDefinition: [
        rydoo,
        "userId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rydoo.getUser({
      $,
      userId: this.userId,
    });

    const user = response?.data || response;
    $.export("$summary", `Successfully retrieved details for user ${user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : this.userId}.`);

    return response;
  },
};
