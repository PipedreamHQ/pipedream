import slack from "../../slack.app.mjs";

export default {
  key: "slack-find-user-by-email",
  name: "Find User by Email",
  description: "Find a user by matching against their email. [See docs here](https://api.slack.com/methods/users.lookupByEmail)",
  version: "0.0.5",
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
  async run() {
    return await this.slack.sdk().users.lookupByEmail({
      email: this.email,
    });
  },
};
