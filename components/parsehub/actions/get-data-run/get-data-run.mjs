import parsehub from "../../parsehub.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "parsehub-get-data-run",
  name: "Get Data for a Run",
  description: "Returns the data extracted by a specified run. [See the documentation](https://www.parsehub.com/docs/ref/api/v2/#get-data-for-a-run)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    parsehub,
    runToken: {
      propDefinition: [
        parsehub,
        "runToken",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.parsehub.getRunData({
      runToken: this.runToken,
    });
    $.export("$summary", `Successfully retrieved data for run token: ${this.runToken}`);
    return response;
  },
};
