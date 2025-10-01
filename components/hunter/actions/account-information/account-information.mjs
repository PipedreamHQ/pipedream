import app from "../../hunter.app.mjs";

export default {
  key: "hunter-account-information",
  name: "Account Information",
  description: "Get information about your Hunter account. [See the documentation](https://hunter.io/api-documentation/v2#account).",
  version: "0.0.2",
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
    const response = await this.app.accountInformation({
      $,
    });

    $.export("$summary", "Successfully retrieved account information");
    return response;
  },
};
