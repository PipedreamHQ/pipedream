import linearb from "../../linearb.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "linearb-report-data",
  name: "Report Data to Other Apps",
  description: "Reports data to other apps using LinearB. [See the documentation](https://linearb.helpdocs.io/search/api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    linearb,
    data: {
      propDefinition: [
        linearb,
        "data",
      ],
    },
    destinationUrl: {
      propDefinition: [
        linearb,
        "destinationUrl",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.linearb.reportDataToOtherApps({
      data: this.data,
      destinationUrl: this.destinationUrl,
    });
    $.export("$summary", "Successfully reported data to the specified destination URL");
    return response;
  },
};
