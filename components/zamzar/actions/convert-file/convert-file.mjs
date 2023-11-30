import zamzar from "../../zamzar.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "zamzar-convert-file",
  name: "Convert File",
  description: "Converts an input file to the desired output format using the Zamzar API. [See the documentation](https://developers.zamzar.com/docs)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    zamzar,
    jobSource: {
      propDefinition: [
        zamzar,
        "jobSource",
      ],
    },
    targetFormat: {
      propDefinition: [
        zamzar,
        "targetFormat",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.zamzar.startConversion({
      sourceFile: this.jobSource,
      targetFormat: this.targetFormat,
    });

    $.export("$summary", `Started file conversion job with ID ${response.id}`);
    return response;
  },
};
