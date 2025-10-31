import app from "../../tomba.app.mjs";

export default {
  key: "tomba-get-account",
  name: "Get Account",
  description:
    "Returns information about the current account including usage statistics and plan details. [See the documentation](https://tomba.io/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getAccount({
      $,
    });

    $.export("$summary", "Successfully retrieved account information");
    return response;
  },
};
