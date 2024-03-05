import homeConnect from "../../home_connect.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "home_connect-get-status",
  name: "Get Home Appliance Status",
  description: "Gets the status information of a home appliance. [See the documentation](https://api-docs.home-connect.com/general/#best-practices)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    homeConnect,
    haId: {
      propDefinition: [
        homeConnect,
        "haId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.homeConnect.getApplianceStatus(this.haId);
    $.export("$summary", `Successfully retrieved the status of the home appliance with ID ${this.haId}`);
    return response;
  },
};
