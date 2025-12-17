import app from "../../mailgenius.app.mjs";

export default {
  key: "mailgenius-get-daily-limit",
  name: "Get Daily Limit",
  description: "Returns daily limit for api token, how many email tests are used in last 24 hours and how many are still remaining for use. [See the documentation](https://app.mailgenius.com/api-docs/index.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
  },

  async run({ $ }) {
    const response = await this.app.getDailyLimit({
      $,
    });

    $.export("$summary", `Your account has '${response.daily_tests_remaining}' remaining tests today`);

    return response;
  },
};
