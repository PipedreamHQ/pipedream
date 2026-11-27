import app from "../../oneflow.app.mjs";

export default {
  key: "oneflow-list-users",
  name: "List Users",
  description: "List the users in your Oneflow account, optionally filtered by email address or name."
    + " Use the `email` field as the **User Email** of other actions."
    + " [See the documentation](https://developer.oneflow.com/reference/get-users-in-an-account)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "Only return the user with this email address, e.g. `jane@example.com`.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Filter users by name, e.g. `Jane Doe`.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const users = await this.app.paginate({
      $,
      fn: this.app.listUsers,
      maxResults: this.maxResults,
      params: {
        "filter[email]": this.email,
        "filter[name]": this.name,
      },
    });
    $.export("$summary", `Found ${users.length} user${users.length === 1
      ? ""
      : "s"}`);
    return users;
  },
};
