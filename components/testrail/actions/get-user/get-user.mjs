import app from "../../testrail.app.mjs";

export default {
  key: "testrail-get-user",
  name: "Get User",
  description: "Get a TestRail user's id, name, email and role. With no parameters it returns the connected user (\"me\"), looked up by the account's login email, so call it first for \"my\" queries and to get an `assignedToId`. Pass `email` or `userId` to look up someone else (for example to assign a run or result). Example: call with email=\"dana@example.com\" → returns {id: 12, name: \"Dana Reyes\", email, is_active, role}. Common mistake: email lookup needs the TestRail user's exact email and a TestRail admin may be required for other users. [See the documentation](https://support.testrail.com/hc/en-us/articles/7077935129364-Users)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "Email of the user to look up. Omit both `email` and `userId` to get the connected user.",
      optional: true,
    },
    userId: {
      type: "integer",
      label: "User ID",
      description: "Numeric TestRail user id to look up. Ignored when `email` is set.",
      optional: true,
    },
  },
  async run({ $ }) {
    let user;
    if (this.email) {
      user = await this.app.getUserByEmail({
        $,
        params: {
          email: this.email,
        },
      });
    } else if (this.userId) {
      user = await this.app.getUser({
        $,
        userId: this.userId,
      });
    } else {
      user = await this.app.getUserByEmail({
        $,
        params: {
          email: this.app.$auth.username,
        },
      });
    }
    $.export("$summary", `Found user ${user.name} (id ${user.id})`);
    return user;
  },
};
