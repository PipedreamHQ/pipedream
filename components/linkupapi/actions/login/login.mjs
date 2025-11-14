import app from "../../linkupapi.app.mjs";

export default {
  type: "action",
  key: "linkupapi-login",
  name: "Login",
  description: "Authenticate with LinkedIn credentials. [See the documentation](https://docs.linkupapi.com/api-reference/linkup/authentication/login)",
  version: "0.0.1",
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    password: {
      propDefinition: [
        app,
        "password",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
  },
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  async run({ $ }) {
    const {
      app,
      email,
      password,
      country,
    } = this;

    const response = await app.login({
      $,
      data: {
        email,
        password,
        country,
      },
    });

    $.export("$summary", "Successfully authenticated with LinkedIn account");

    return response;
  },
};
