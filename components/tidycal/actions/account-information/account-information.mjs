import app from "../../tidycal.app.mjs";

export default {
  key: "tidycal-account-information",
  name: "Account Information",
  description: "Get account details. [See the documentation](https://tidycal.com/developer/docs/#tag/Account/operation/get-account)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  methods: {
    getAccountInformation(args = {}) {
      return this.app.makeRequest({
        path: "/me",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const response = await this.getAccountInformation();

    step.export("$summary", `Successfully retrieved account information for ${response.email}.`);

    return response;
  },
};
