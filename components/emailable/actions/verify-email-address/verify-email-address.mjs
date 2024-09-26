import app from "../../emailable.app.mjs";

export default {
  key: "emailable-verify-email-address",
  name: "Verify Email Address",
  description: "Verifies a single email address using Emailable. [See the documentation](https://emailable.com/docs/api/#verify-an-email)",
  version: "0.0.1",
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
  methods: {
    verifyEmail(args = {}) {
      return this.app._makeRequest({
        path: "/verify",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      verifyEmail,
      email,
    } = this;

    const response = await verifyEmail({
      $,
      params: {
        email,
      },
    });
    $.export("$summary", `Successfully email verified with status: \`${response.state}\``);
    return response;
  },
};
