import beeboleApp from "../../beebole_app.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "beebole_app-list-companies",
  name: "List Companies",
  description: "List all companies in the Beebole platform. [See the documentation](https://beebole.com/help/api/#list-companies)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    beeboleApp,
  },
  async run({ $ }) {
    const response = await this.beeboleApp.listCompanies();
    $.export("$summary", "Successfully listed companies");
    return response;
  },
};