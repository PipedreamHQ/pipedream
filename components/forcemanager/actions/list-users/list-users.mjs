import forcemanager from "../../forcemanager.app.mjs";

export default {
  key: "forcemanager-list-users",
  name: "List All Users",
  description: "Returns a list of all users in the app. [See the documentation](https://developer.forcemanager.com/#d91467e1-c380-4cce-8207-840b570a5471)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    forcemanager,
  },
  async run({ $ }) {
    const results = this.forcemanager.paginate({
      resourceFn: this.forcemanager.listUsers,
      args: {
        $,
      },
    });
    const users = [];
    for await (const user of results) {
      users.push(user);
    }
    $.export("$summary", `Successfully retrieved ${users.length} user${users.length === 1
      ? ""
      : "s"}`);
    return users;
  },
};
