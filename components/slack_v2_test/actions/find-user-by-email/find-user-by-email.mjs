import slack from "../../slack_v2_test.app.mjs";

export default {
  key: "slack_v2_test-find-user-by-email",
  name: "Find User by Email",
  description: "Find a user by matching against their email. [See the documentation](https://api.slack.com/methods/users.lookupByEmail)",
  version: "0.0.3",
  type: "action",
  props: {
    slack,
    email: {
      propDefinition: [
        slack,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.slack.lookupUserByEmail({
      email: this.email,
    });
    if (response.ok) {
      $.export("$summary", `Successfully found user with ID ${response.user.id}`);
    }
    return response;
  },
};
