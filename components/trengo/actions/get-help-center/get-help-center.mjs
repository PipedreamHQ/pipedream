import app from "../../trengo.app.mjs";

export default {
  key: "trengo-get-help-center",
  name: "Get Help Center",
  description: "Get a specific help center. [See the documentation](https://developers.trengo.com/reference/get-a-help-center)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    helpCenterId: {
      propDefinition: [
        app,
        "helpCenterId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getHelpCenter({
      $,
      helpCenterId: this.helpCenterId,
    });
    $.export("$summary", "Successfully retrieved help center");
    return response;
  },
};
