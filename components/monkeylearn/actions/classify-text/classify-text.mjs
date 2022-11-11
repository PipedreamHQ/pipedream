import app from "../../monkeylearn.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "monkeylearn-classify-text",
  name: "Classify Text",
  description: "Classifies texts with a given classifier. [See the docs here](https://monkeylearn.com/api/v3/#classify)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    classifierId: {
      propDefinition: [
        app,
        "classifierId",
      ],
    },
    data: {
      label: "Data",
      type: "string[]",
      description: "A list of up to 500 data elements to classify. Each element must be a string with the text.",
    }
  },
  async run({ $ }) {
    const {
      classifierId,
      data,
    } = this;
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new ConfigurationError("Data array is required and must have at least one string to be classified.");
    }
    const response = await this.app.classifyText($, classifierId, data);
    $.export("$summary", "Successfully classified all elements");
    return response;
  },
};
