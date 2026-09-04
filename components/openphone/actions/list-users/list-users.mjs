import openphone from "../../openphone.app.mjs";

export default {
  key: "openphone-list-users",
  name: "List Users",
  description: "Retrieve a paginated list of users in your OpenPhone workspace. Use this to find a user's ID before assigning a task or filtering calls/messages/conversations by `userId`. Example: call with no inputs → returns up to 10 users, each with `id`, `name`, and `email`. [See the documentation](https://www.openphone.com/docs/api-reference/users/list-users)",
  version: "0.0.3",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    openphone,
    maxResults: {
      propDefinition: [
        openphone,
        "userMaxResults",
      ],
    },
    pageToken: {
      propDefinition: [
        openphone,
        "pageToken",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.openphone.listUsers({
      $,
      params: {
        maxResults: this.maxResults,
        pageToken: this.pageToken,
      },
    });
    const users = response?.data ?? [];
    $.export("$summary", `Retrieved ${users.length} user${users.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
