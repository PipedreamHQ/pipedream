import wordpress from "../../wordpress_org.app.mjs";
import pickBy from "lodash.pickby";

export default {
  key: "wordpress_org-update-user",
  name: "Update User",
  description: "Updates the information of a user. [See the docs here](https://developer.wordpress.org/rest-api/reference/users/#update-a-user-2)",
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
    username: {
      propDefinition: [
        wordpress,
        "username",
      ],
      optional: true,
    },
    name: {
      propDefinition: [
        wordpress,
        "name",
      ],
    },
    firstName: {
      propDefinition: [
        wordpress,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        wordpress,
        "lastName",
      ],
    },
    email: {
      propDefinition: [
        wordpress,
        "email",
      ],
      optional: true,
    },
    url: {
      propDefinition: [
        wordpress,
        "url",
      ],
    },
    description: {
      propDefinition: [
        wordpress,
        "description",
      ],
    },
    roles: {
      propDefinition: [
        wordpress,
        "roles",
      ],
    },
    password: {
      propDefinition: [
        wordpress,
        "password",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const params = pickBy({
      username: this.username,
      name: this.name,
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      url: this.url,
      description: this.description,
      roles: this.roles && [
        this.roles,
      ],
      password: this.password,
    });

    const response = await this.wordpress.updateUser(this.user, params);

    $.export("$summary", `Updated user with ID ${this.user}`);

    return response;
  },
};
