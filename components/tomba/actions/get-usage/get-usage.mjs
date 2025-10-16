import app from "../../tomba.app.mjs";

export default {
  key: "tomba-get-usage",
  name: "Get Usage",
  description:
    "Retrieve API usage statistics and quota information for your account. [See the documentation](https://tomba.io/api)",
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
    const response = await this.app.getUsage({
      $,
    });

    $.export("$summary", "Successfully retrieved API usage statistics");
    return response;
  },
};
