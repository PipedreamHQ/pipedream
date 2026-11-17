import app from "../../testrail.app.mjs";

export default {
  key: "testrail-list-users",
  name: "List Users",
  description: "Lists TestRail users, or looks one up by email. Use it to answer \"who am I in TestRail\" (pass `email` = `me`) or to find a user ID for an assignee. To find projects use **List Projects**; this tool only returns people. Returns each user's id, name, email, role and active flag; `hasMore`/`nextOffset` signal more pages. Example: email=\"me\" → the connected account's user with its id and role. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
      description: "Email address of one user to look up, or `me` for the connected account (its username is its email). Leave empty to list all users. Requires admin rights to list all users on some instances.",
      optional: true,
    },
    isActive: {
      type: "boolean",
      label: "Only Active Users",
      description: "When true, only return active users. Ignored when `email` is set.",
      optional: true,
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    if (this.email) {
      const email = this.email.toLowerCase() === "me"
        ? this.app.$auth.username
        : this.email;
      const user = await this.app.get({
        $,
        path: "get_user_by_email",
        params: {
          email,
        },
      });
      $.export("$summary", `Found user ${user.name} (${user.id})`);
      return {
        items: [
          user,
        ],
        size: 1,
        hasMore: false,
        nextOffset: null,
      };
    }
    const page = await this.app.listPage({
      $,
      path: "get_users",
      key: "users",
      limit: this.limit,
      offset: this.offset,
    });
    if (this.isActive) page.items = page.items.filter((u) => u.is_active);
    page.items = page.items.map(({
      id, name, email, role, is_active,
    }) => ({
      id,
      name,
      email,
      role,
      is_active,
    }));
    page.size = page.items.length;
    $.export("$summary", `Found ${page.size} users`);
    return page;
  },
};
