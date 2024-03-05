import homeConnect from "../../home_connect.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "home_connect-get-appliances",
  name: "Get Paired Home Appliances",
  description: "Retrieves a list of paired home appliances. [See the documentation](https://api-docs.home-connect.com/general/#best-practices)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    homeConnect,
  },
  async run({ $ }) {
    const response = await this.homeConnect.getPairedAppliances();
    $.export("$summary", "Successfully retrieved paired home appliances");
    return response;
  },
};
