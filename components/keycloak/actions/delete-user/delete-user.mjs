import app from "../../keycloak.app.mjs";

export default {
  key: "keycloak-delete-user",
  name: "Delete User",
  description: "Delete a user from Keycloak. [See the documentation](https://www.keycloak.org/docs-api/latest/rest-api/index.html#_users)",
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
  },
  methods: {
    deleteUser({
      realm, userId, ...args
    } = {}) {
      return this.app.delete({
        path: `/admin/realms/${realm}/users/${userId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      deleteUser,
      realm,
      userId,
    } = this;

    await deleteUser({
      $,
      realm,
      userId,
    });

    $.export("$summary", "Successfully deleted user.");

    return {
      success: true,
    };
  },
};
