import rippling from "../../rippling.app.mjs";

export default {
  key: "rippling-get-user",
  name: "Get User",
  description: "Retrieves a specific user from Rippling. [See the documentation](https://developer.rippling.com/documentation/rest-api/reference/get-users)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    rippling,
    userId: {
      propDefinition: [
        rippling,
        "userId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rippling.getUser({
      $,
      userId: this.userId,
    });

    $.export("$summary", `Successfully retrieved user with ID: ${this.userId}`);
    return response;
  },
};
