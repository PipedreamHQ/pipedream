import wordpress from "../../wordpress_org.app.mjs";

export default {
  key: "wordpress_org-get-user",
  name: "Get User",
  description: "Retrieves information for a user. [See the docs here](https://developer.wordpress.org/rest-api/reference/users/#retrieve-a-user-2)",
  version: "0.0.1",
  type: "action",
  props: {
    wordpress,
    user: {
      propDefinition: [
        wordpress,
        "user",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.wordpress.getUser(this.user);

    $.export("$summary", `Retrieved information for user with ID ${this.user}`);

    return response;
  },
};
