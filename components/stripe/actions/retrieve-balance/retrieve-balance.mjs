import app from "../../stripe.app.mjs";

export default {
  key: "stripe-retrieve-balance",
  name: "Retrieve the Current Balance",
  type: "action",
  version: "0.1.3",
  description: "Retrieves the current account balance, based on the authentication that was used to make the request. [See the documentation](https://stripe.com/docs/api/balance/balance_retrieve).",
  props: {
    app,
  },
  async run({ $ }) {
    const resp = await this.app.sdk().balance.retrieve();
    $.export("$summary", "Successfully retrieved the current balance");
    return resp;
  },
};
