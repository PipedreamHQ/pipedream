import app from "../../app/paypal.app.mjs";

export default {
  key: "paypal-get-user-info",
  name: "Get User Info",
  description: "Shows user profile information. [See docs here](https://developer.paypal.com/docs/api/identity/v1)",
  version: "0.2.0",
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getUserInfo({
      $,
    });

    if (response) {
      $.export("$summary", `Successfully retrieved user info with ID ${response.id}`);
    }

    return response;
  },
};
