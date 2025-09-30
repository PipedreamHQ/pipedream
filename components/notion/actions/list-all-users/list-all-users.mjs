import notion from "../../notion.app.mjs";

export default {
  key: "notion-list-all-users",
  name: "List All Users",
  description: "Returns all users in the workspace. [See the documentation](https://developers.notion.com/reference/get-users)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    notion,
  },
  async run({ $ }) {
    const response = this.notion.paginate({
      fn: this.notion.getUsers,
    });
    const users = [];
    for await (const user of response) {
      users.push(user);
    }
    $.export("$summary", `Successfully retrieved ${users.length} users`);
    return users;
  },
};
