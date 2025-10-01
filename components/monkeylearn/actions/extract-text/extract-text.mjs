import app from "../../monkeylearn.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "monkeylearn-extract-text",
  name: "Extract Text",
  description: "Extracts information from texts with a given extractor. [See the docs here](https://monkeylearn.com/api/v3/#extract)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    extractorId: {
      propDefinition: [
        app,
        "extractorId",
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
      extractorId,
      data,
      productionModel,
    } = this;
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new ConfigurationError("Data array is required and must have at least one string to be classified.");
    }
    const response = await this.app.extractText($, extractorId, data, productionModel);
    $.export("$summary", "Successfully extracted from all elements");
    return response;
  },
};
