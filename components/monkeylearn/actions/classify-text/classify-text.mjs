import app from "../../monkeylearn.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "monkeylearn-classify-text",
  name: "Classify Text",
  description: "Classifies texts with a given classifier. [See the docs here](https://monkeylearn.com/api/v3/#classify)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      propDefinition: [
        app,
        "data",
      ],
    },
    productionModel: {
      propDefinition: [
        app,
        "productionModel",
      ],
    },
  },
  async run({ $ }) {
    const {
      classifierId,
      data,
      productionModel,
    } = this;
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new ConfigurationError("Data array is required and must have at least one string to be classified.");
    }
    const response = await this.app.classifyText($, classifierId, data, productionModel);
    $.export("$summary", "Successfully classified all elements");
    return response;
  },
};
