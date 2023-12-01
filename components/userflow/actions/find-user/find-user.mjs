import userflow from "../../userflow.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "userflow-find-user",
  name: "Find User",
  description: "Finds an existing user by user ID or email, optionally filtering by group ID. [See the documentation](https://userflow.com/docs/api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    userflow,
    userId: {
      propDefinition: [
        userflow,
        "userId",
      ],
    },
    email: {
      propDefinition: [
        userflow,
        "email",
      ],
    },
    groupId: {
      propDefinition: [
        userflow,
        "groupId",
      ],
    },
  },
  async run({ $ }) {
    if (!this.userId && !this.email) {
      throw new Error("You must provide either a User ID or an Email.");
    }

    const response = await this.userflow.findUser({
      userId: this.userId,
      email: this.email,
      groupId: this.groupId,
    });

    $.export("$summary", `Successfully found user with ID: ${this.userId || "email: " + this.email}`);
    return response;
  },
};
