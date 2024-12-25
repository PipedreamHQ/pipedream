import app from "../../pingone.app.mjs";

export default {
  key: "pingone-update-user",
  name: "Update User in PingOne",
  description: "Update an existing user's attributes in PingOne. [See the documentation](https://apidocs.pingidentity.com/pingone/platform/v1/api/#patch-update-user).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
    username: {
      optional: false,
      propDefinition: [
        app,
        "username",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    givenName: {
      propDefinition: [
        app,
        "givenName",
      ],
    },
    familyName: {
      propDefinition: [
        app,
        "familyName",
      ],
    },
    department: {
      propDefinition: [
        app,
        "department",
      ],
    },
    locales: {
      propDefinition: [
        app,
        "locales",
      ],
    },
  },
  methods: {
    updateUser({
      userId, ...args
    } = {}) {
      return this.app.patch({
        path: `/users/${userId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      updateUser,
      userId,
      username,
      email,
      givenName,
      familyName,
      department,
      locales,
    } = this;

    const response = await updateUser({
      $,
      userId,
      data: {
        username,
        email,
        givenName,
        familyName,
        department,
        locales,
      },
    });

    $.export("$summary", "Successfully updated user.");
    return response;
  },
};
