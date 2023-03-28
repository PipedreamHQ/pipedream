import app from "../../hugging_face.app.mjs";
import tag from "../common/tag.mjs";

export default {
  key: "hugging_face-text-classification",
  name: "Text Classification",
  description: "Usually used for sentiment-analysis this will output the likelihood of classes of an input. This action allows you to classify text into categories. [See the docs](https://huggingface.co/docs/huggingface.js/inference/classes/HfInference#textclassification).",
  type: "action",
  version: "0.0.1",
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
  },
  async run({ $: step }) {
    const {
      modelId,
      text,
    } = this;

    const response = await this.app.inference({
      step,
      modelId,
      data: {
        inputs: text,
      },
    });

    step.export("$summary", "Successfully classified text");

    return response;
  },
};
