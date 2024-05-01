import { axios } from "@pipedream/platform";
import flipando from "../../flipando.app.mjs";

export default {
  key: "flipando-get-all-apps",
  name: "Get All Apps",
  description: "Fetches a list of all apps that the user had created within flipando.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    flipando,
  },
  async run({ $ }) {
    const response = await this.flipando.listApps();
    $.export("$summary", `Fetched ${response.length} apps.`);
    return response;
  },
};
