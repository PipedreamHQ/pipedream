import diffbot from "../../diffbot.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "diffbot-extract-website",
  name: "Extract Website Data",
  description: "Analyzes a specific website and extracts meaningful data from it. [See the documentation](https://www.diffbot.com/dev/docs/analyze/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    diffbot,
    websiteUrl: {
      propDefinition: [
        diffbot,
        "websiteUrl",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.diffbot.analyzeWebsite({
      websiteUrl: this.websiteUrl,
    });
    $.export("$summary", `Successfully extracted data from website: ${this.websiteUrl}`);
    return response;
  },
};
