import grain from "../../grain.app.mjs";

export default {
  key: "grain-list-users",
  name: "List Users",
  description: "Lists the users in your Grain workspace (id, name, email)."
    + " Use this to resolve a user's ID before sharing a recording with them via **Manage Recording Sharing**, or to identify who's who when reviewing recording participants."
    + " Example: returns `[{\"id\": \"d91b7ed0-a149-425c-9623-0664148e4fc1\", \"name\": \"Danny Archer\", \"email\": \"darcher@pipedream.com\"}]`."
    + " [See the documentation](https://developers.grain.com/#list-users)",
  version: "0.0.1",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    grain,
  },
  async run({ $ }) {
    const { users } = await this.grain.listUsers({
      $,
    });

    $.export("$summary", `Found ${users.length} user${users.length === 1
      ? ""
      : "s"}`);
    return users;
  },
};
