import wordpress from "../../wordpress_org.app.mjs";

export default {
  key: "wordpress_org-create-user",
  name: "Create User",
  description: "Creates a user. [See the documentation](https://developer.wordpress.org/rest-api/reference/users/#create-a-user)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    wordpress,
    username: {
      propDefinition: [
        wordpress,
        "username",
      ],
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
    },
  },
  async run({ $ }) {
    const params = {
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
    };
    try {
      const resp = await this.wordpress.createUser(params);
      $.export("$summary", "Successfully created new user.");
      return resp;
    } catch (e) {
      throw new Error(JSON.stringify(e));
    }
  },
};
