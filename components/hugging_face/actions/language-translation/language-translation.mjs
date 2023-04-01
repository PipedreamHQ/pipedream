import app from "../../hugging_face.app.mjs";
import tag from "../common/tag.mjs";

export default {
  key: "hugging_face-language-translation",
  name: "Language Translation",
  description: "This task is well known to translate text from one language to another. [See the docs](https://huggingface.co/docs/huggingface.js/inference/classes/HfInference#translation).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    modelId: {
      propDefinition: [
        app,
        "modelId",
        () => ({
          tagFilter: tag.TRANSLATION,
        }),
      ],
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text to use for translation.",
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

    step.export("$summary", "Successfully translated text");

    return response;
  },
};
