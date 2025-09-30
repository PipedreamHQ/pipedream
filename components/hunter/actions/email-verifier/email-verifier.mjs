import app from "../../hunter.app.mjs";

export default {
  key: "hunter-email-verifier",
  name: "Email Verifier",
  description: "Check the deliverability of a given email address, verify if it has been found in Hunter's database, and return their sources. [See the documentation](https://hunter.io/api-documentation/v2#email-verifier).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      email,
    } = this;

    const response = await app.emailVerifier({
      $,
      params: {
        email,
      },
    });

    $.export("$summary", "Successfully verified email address");
    return response;
  },
};
