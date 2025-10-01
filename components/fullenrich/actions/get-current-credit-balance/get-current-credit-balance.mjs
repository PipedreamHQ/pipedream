import app from "../../fullenrich.app.mjs";

export default {
  key: "fullenrich-get-current-credit-balance",
  name: "Get Current Credit Balance",
  description: "Provides the current balance of credits available in your workspace. [See the documentation](https://docs.fullenrich.com/getcredit).",
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
  methods: {
    getCurrentCreditBalance() {
      return this.app._makeRequest({
        path: "/account/credits",
      });
    },
  },
  async run({ $ }) {
    const response = await this.getCurrentCreditBalance();
    $.export("$summary", `Successfully retrieved current credit balance of \`${response.balance}\` credits.`);
    return response;
  },
};
