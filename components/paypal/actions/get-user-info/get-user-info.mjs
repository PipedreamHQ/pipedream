import app from "../../paypal.app.mjs";

export default {
  key: "paypal-get-user-info",
  name: "Get User Info",
  description: "Shows user profile information. [See docs here](https://developer.paypal.com/docs/api/identity/v1)",
  version: "0.2.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getUserInfo({
      $,
    });

    if (response) {
      $.export("$summary", "Successfully retrieved user info");
    }

    return response;
  },
};
