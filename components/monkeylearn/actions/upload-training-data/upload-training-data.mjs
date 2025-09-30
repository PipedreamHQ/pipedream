import app from "../../monkeylearn.app.mjs";
import common from "../common/common.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "monkeylearn-upload-training-data",
  name: "Upload Training Data",
  description: "Uploads data to a classifier. This component can be used to upload new data to a classifier, to update the tags of texts that have already been uploaded, or both. [See the docs here](https://monkeylearn.com/api/v3/#upload-classifier-data)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
    dataObjectArray: {
      propDefinition: [
        app,
        "dataObjectArray",
      ],
    },
    inputDuplicatesStrategy: {
      propDefinition: [
        app,
        "inputDuplicatesStrategy",
      ],
    },
    existingDuplicatesStrategy: {
      propDefinition: [
        app,
        "existingDuplicatesStrategy",
      ],
    },
  },
  async run({ $ }) {
    const {
      classifierId,
      dataObjectArray,
      inputDuplicatesStrategy,
      existingDuplicatesStrategy,
    } = this;
    const data = common.formatObjectArray(dataObjectArray);
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new ConfigurationError("Data must to be an array and must have at least one object.");
    }
    const params = {
      data,
      input_duplicates_strategy: inputDuplicatesStrategy,
      existing_duplicates_strategy: existingDuplicatesStrategy,
    };
    const response = await this.app.uploadClassifierTrainingData($, classifierId, params);
    $.export("$summary", "Successfully uploaded training data");
    return response;
  },
};
