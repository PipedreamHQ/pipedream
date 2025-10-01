import app from "../../keycloak.app.mjs";

export default {
  key: "keycloak-get-user",
  name: "Get User",
  description: "Retrieve the representation of the user. [See the documentation](https://www.keycloak.org/docs-api/latest/rest-api/index.html#_users)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    getUser({
      realm, userId, ...args
    } = {}) {
      return this.app._makeRequest({
        path: `/admin/realms/${realm}/users/${userId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      getUser,
      realm,
      userId,
    } = this;

    const response = await getUser({
      $,
      realm,
      userId,
    });
    $.export("$summary", `Successfully retrieved user with ID \`${response.id}\`.`);
    return response;
  },
};
