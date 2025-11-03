import app from "../../hugging_face.app.mjs";
import tag from "../common/tag.mjs";

export default {
  key: "hugging_face-document-question-answering",
  name: "Document Question Answering",
  description: "Want to have a nice know-it-all bot that can answer any question?. This action allows you to ask a question and get an answer from a trained model. [See the docs](https://huggingface.co/docs/huggingface.js/inference/classes/HfInference#questionanswer).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    modelId: {
      propDefinition: [
        app,
        "modelId",
        () => ({
          tagFilter: tag.DOCUMENT_QUESTION_ANSWERING,
        }),
      ],
    },
    imageUrl: {
      description: "The image url to use for answering the question.",
      propDefinition: [
        app,
        "imageUrl",
      ],
    },
    question: {
      type: "string",
      label: "Question",
      description: "The question to ask.",
    },
  },
  async run({ $: step }) {
    const {
      modelId,
      imageUrl,
      question,
    } = this;

    const image = await this.app.getBinaryFromUrl(imageUrl);

    const response = await this.app.inference({
      step,
      modelId,
      data: {
        inputs: {
          image,
          question,
        },
      },
    });

    step.export("$summary", `Successfully answered question with score ${response[0].score}`);

    return response;
  },
};
