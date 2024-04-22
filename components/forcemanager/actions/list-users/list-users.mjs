import forcemanager from "../../forcemanager.app.mjs";

export default {
  key: "forcemanager-list-users",
  name: "List All Users",
  description: "Returns a list of all users in the app. [See the documentation](https://developer.forcemanager.net)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    forcemanager,
  },
  async run({ $ }) {
    const users = await this.forcemanager.listUsers();
    $.export("$summary", `Fetched ${users.length} users`);
    return users;
  },
};
