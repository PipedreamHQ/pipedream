import { ConfigurationError } from "@pipedream/platform";
import app from "../../hugging_face.app.mjs";
import utils from "../../common/utils.mjs";
import tag from "../common/tag.mjs";

export default {
  key: "hugging_face-text-classification",
  name: "Text Classification",
  description: "Usually used for sentiment-analysis this will output the likelihood of classes of an input. This action allows you to classify text into categories. [See the docs](https://huggingface.co/docs/huggingface.js/inference/classes/HfInference#textclassification).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    modelId: {
      propDefinition: [
        app,
        "modelId",
        () => ({
          tagFilter: tag.TEXT_CLASSIFICATION,
        }),
      ],
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text to use for classification.",
    },
    additionalFields: {
      type: "object",
      label: "Additional Fields",
      description: "Additional fields to include in the request in case the model requires them. E.g you can set `parameters` as a key and `{\"candidate_labels\":[\"love\",\"like\"]}` as a value. Or Just something like `my_field` as a key and `my_value` as a value.",
      optional: true,
    },
  },
  async run({ $: step }) {
    const {
      modelId,
      text,
      additionalFields,
    } = this;

    if (additionalFields && typeof(additionalFields) !== "object" && additionalFields !== null) {
      throw new ConfigurationError("Additional Fields property must be an object.");
    }

    const response = await this.app.inference({
      step,
      modelId,
      data: {
        inputs: text,
        ...utils.parseFields(additionalFields),
      },
    });

    step.export("$summary", "Successfully classified text");

    return response;
  },
};
