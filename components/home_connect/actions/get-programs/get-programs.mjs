import app from "../../home_connect.app.mjs";

export default {
  key: "home_connect-get-programs",
  name: "Get Available Programs",
  description: "Get a list of available programs of a home appliance. [See the documentation](https://api-docs.home-connect.com/programs-and-options/#cleaning-robot_cleaning-mode-option)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    haId: {
      propDefinition: [
        app,
        "haId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getAvailablePrograms({
      $,
      haId: this.haId,
    });

    $.export("$summary", `Successfully retrieved available programs for appliance ${this.haId}`);

    return response;
  },
};
