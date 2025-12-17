/* eslint-disable no-unused-vars */
import app from "../../keycloak.app.mjs";

export default {
  key: "keycloak-create-user",
  name: "Create User",
  description: "Create a new user in Keycloak. The username must be unique. [See the documentation](https://www.keycloak.org/docs-api/latest/rest-api/index.html#_users)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    realm: {
      propDefinition: [
        app,
        "realm",
      ],
    },
    username: {
      type: "string",
      label: "Username",
      description: "The username of the user.",
    },
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    emailVerified: {
      propDefinition: [
        app,
        "emailVerified",
      ],
    },
    enabled: {
      propDefinition: [
        app,
        "enabled",
      ],
    },
  },
  methods: {
    createUser({
      realm, ...args
    } = {}) {
      return this.app.post({
        path: `/admin/realms/${realm}/users`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      app,
      createUser,
      realm,
      ...data
    } = this;

    await createUser({
      $,
      realm,
      data,
    });

    $.export("$summary", "Successfully created user.");

    return {
      success: true,
    };
  },
};
