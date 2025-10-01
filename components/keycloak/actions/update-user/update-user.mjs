/* eslint-disable no-unused-vars */
import app from "../../keycloak.app.mjs";

export default {
  key: "keycloak-update-user",
  name: "Update User",
  description: "Updates a user in Keycloak. [See the documentation](https://www.keycloak.org/docs-api/latest/rest-api/index.html#_users)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
    userId: {
      propDefinition: [
        app,
        "userId",
        ({ realm }) => ({
          realm,
        }),
      ],
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
    updateUser({
      realm, userId, ...args
    } = {}) {
      return this.app.put({
        path: `/admin/realms/${realm}/users/${userId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      app,
      updateUser,
      realm,
      userId,
      ...data
    } = this;

    await updateUser({
      $,
      realm,
      userId,
      data,
    });

    $.export("$summary", "Successfully updated user.");

    return {
      success: true,
    };
  },
};
