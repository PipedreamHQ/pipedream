import _twocaptcha from "../../_twocaptcha.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "_twocaptcha-check-account-balance",
  name: "Check 2Captcha Account Balance",
  description: "Get the current account balance from the 2Captcha API. [See the documentation](https://2captcha.com/api-docs/get-balance)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    _twocaptcha,
    clientKey: {
      propDefinition: [
        _twocaptcha,
        "clientKey",
      ],
    },
  },
  async run({ $ }) {
    const response = await this._twocaptcha.getBalance({
      clientKey: this.clientKey,
    });
    $.export("$summary", `Current account balance is $${response.balance}`);
    return response;
  },
};
