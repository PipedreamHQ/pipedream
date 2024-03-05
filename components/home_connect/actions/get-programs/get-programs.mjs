import homeConnect from "../../home_connect.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "home_connect-get-programs",
  name: "Get Available Programs",
  description: "Get a list of available programs of a home appliance. [See the documentation](https://api-docs.home-connect.com/programs-and-options/#cleaning-robot_cleaning-mode-option)",
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
    const response = await this.homeConnect.getAvailablePrograms(this.haId);
    $.export("$summary", `Successfully retrieved available programs for appliance ${this.haId}`);
    return response;
  },
};
