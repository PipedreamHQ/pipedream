import awork from "../../awork.app.mjs";

export default {
  name: "Find Users By Email",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "awork-find-users-by-email",
  description: "Finds a user by email. [See docs here](https://openapi.awork.io/#/Users/get_users)",
  type: "action",
  props: {
    awork,
    email: {
      label: "Email",
      description: "The email to find",
      type: "string",
    },
  },
  async run({ $ }) {
    let page = 1;

    const foundUsers = [];

    while (page >= 1) {
      const users = await this.awork.getUsers({
        $,
        params: {
          page,
          pageSize: 100,
        },
      });

      users.forEach((user) => {
        let found = false;

        user.userContactInfos.forEach((contactInfo) => found = contactInfo.type === "email" && contactInfo.value.includes(this.email));

        if (found) {
          foundUsers.push(user);
        }
      });

      if (users.length <= 100) {
        page = -1;
      }

      page++;
    }

    $.export("$summary", "Successfully retrieved users");

    return foundUsers;
  },
};
