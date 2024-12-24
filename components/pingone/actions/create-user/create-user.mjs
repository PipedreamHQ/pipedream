import app from "../../pingone.app.mjs";

export default {
  key: "pingone-create-user",
  name: "Create User",
  description: "Creates a new user in PingOne. [See the documentation](https://apidocs.pingidentity.com/pingone/platform/v1/api/#post-create-user).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    username: {
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
    createUser(args = {}) {
      return this.app.post({
        path: "/users",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createUser,
      username,
      email,
      givenName,
      familyName,
      department,
      locales,
    } = this;

    const response = await createUser({
      $,
      data: {
        username,
        email,
        name: {
          given: givenName,
          family: familyName,
        },
        department,
        locales,
      },
    });

    $.export("$summary", "Successfully created user.");
    return response;
  },
};
