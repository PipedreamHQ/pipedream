import _twocaptcha from "../../_twocaptcha.app.mjs";

export default {
  key: "_twocaptcha-check-account-balance",
  name: "Check 2Captcha Account Balance",
  description: "Get the current account balance from the 2Captcha API. [See the documentation](https://2captcha.com/api-docs/get-balance)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    _twocaptcha,
  },
  async run({ $ }) {
    const response = await this._twocaptcha.getBalance({
      $,
    });
    $.export("$summary", `Current account balance is $${response.balance}`);
    return response;
  },
};
