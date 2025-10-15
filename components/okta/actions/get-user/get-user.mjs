import okta from "../../okta.app.mjs";

export default {
  key: "okta-get-user",
  name: "Get User",
  description: "Fetches the information of a specific user from the Okta system. [See the documentation](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/getUser)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    okta,
    userId: {
      propDefinition: [
        okta,
        "userId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.okta.getUser({
      $,
      userId: this.userId,
    });
    $.export("$summary", `Successfully fetched user details for user ID ${this.userId}`);
    return response;
  },
};
