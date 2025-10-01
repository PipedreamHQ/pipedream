import app from "../../home_connect.app.mjs";

export default {
  key: "home_connect-get-appliances",
  name: "Get Home Appliances",
  description: "Retrieves a list of paired home appliances. [See the documentation](https://apiclient.home-connect.com/#/appliances/get_home_appliances)",
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
    const response = await this.app.getAppliances($);

    $.export("$summary", "Successfully retrieved paired home appliances");

    return response;
  },
};
