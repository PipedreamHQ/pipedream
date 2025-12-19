import googleDirectory from "../../google_directory.app.mjs";

export default {
  key: "google_directory-list-users",
  name: "List Users",
  description: "Retrieves a list of directory users. [See the documentation](https://developers.google.com/admin-sdk/directory/reference/rest/v1/users/list)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    googleDirectory,
  },
  async run({ $ }) {
    const results = this.googleDirectory.paginate({
      fn: this.googleDirectory.listUsers,
      params: {
        customer: "my_customer",
      },
      itemType: "users",
      $,
    });

    const users = [];
    for await (const user of results) {
      users.push(user);
    }

    $.export("$summary", `Successfully retrieved ${users.length} user${users.length === 1
      ? ""
      : "s"}.`);

    return users;
  },
};
