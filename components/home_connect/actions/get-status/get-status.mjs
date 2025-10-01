import app from "../../home_connect.app.mjs";

export default {
  key: "home_connect-get-status",
  name: "Get Home Appliance Status",
  description: "Gets the status information of a home appliance. [See the documentation](https://api-docs.home-connect.com/general/#best-practices)",
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
    const response = await this.app.getApplianceStatus({
      $,
      haId: this.haId,
    });

    $.export("$summary", `Successfully retrieved the status of the home appliance with ID ${this.haId}`);

    return response;
  },
};
