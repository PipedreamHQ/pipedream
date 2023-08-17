import teachable from "../../teachable.app.mjs";

export default {
  key: "teachable-search-students",
  name: "Search Students",
  description: "Searches for a student by email address. [See the documentation](https://docs.teachable.com/reference/listusers)",
  version: "0.0.1",
  type: "action",
  props: {
    teachable,
    email: {
      propDefinition: [
        teachable,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const { users } = await this.teachable.listUsers({
      params: {
        email: this.email,
      },
      $,
    });

    if (users?.length) {
      $.export("$summary", `Found ${users.length} user${users.length === 1
        ? ""
        : "s"} with matching email.`);
    }

    return users;
  },
};
