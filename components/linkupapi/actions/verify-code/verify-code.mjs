import app from "../../linkupapi.app.mjs";

export default {
  type: "action",
  key: "linkupapi-verify-code",
  name: "Verify Code",
  description: "Verify security code for LinkedIn authentication. [See the documentation](https://docs.linkupapi.com/api-reference/linkup/authentication/verify)",
  version: "0.0.1",
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    code: {
      propDefinition: [
        app,
        "code",
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
    idempotentHint: false,
  },
  async run({ $ }) {
    const {
      app,
      email,
      code,
      country,
    } = this;

    const response = await app.verify({
      $,
      data: {
        email,
        code,
        country,
      },
    });

    $.export("$summary", "Successfully verified code for email");

    return response;
  },
};
