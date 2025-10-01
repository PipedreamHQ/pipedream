import app from "../../hugging_face.app.mjs";
import utils from "../../common/utils.mjs";
import tag from "../common/tag.mjs";

export default {
  key: "hugging_face-text-summarization",
  name: "Text Summarization",
  description: "This task is well known to summarize longer text into shorter text. Be careful, some models have a maximum length of input. That means that the summary cannot handle full books for instance. Be careful when choosing your model. [See the docs](https://huggingface.co/docs/huggingface.js/inference/classes/HfInference#summarization).",
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
          tagFilter: tag.SUMMARIZATION,
        }),
      ],
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text to use for summarization.",
    },
    maxLength: {
      type: "integer",
      label: "Max Length",
      description: "The maximum length of the summary.",
      optional: true,
    },
    minLength: {
      type: "integer",
      label: "Min Length",
      description: "The minimum length of the summary.",
      optional: true,
    },
    maxTime: {
      type: "integer",
      label: "Max Time",
      description: "The maximum time in seconds to spend on the generation.",
      optional: true,
    },
    repetitionPenalty: {
      type: "string",
      label: "Repetition Penalty",
      description: "The parameter for repetition penalty. 1.0 means no penalty. See [this paper](https://arxiv.org/pdf/1909.05858.pdf) for more details.",
      optional: true,
    },
    temperature: {
      type: "string",
      label: "Temperature",
      description: "The value used to module the next token probabilities. Must be strictly positive. See [this paper](https://arxiv.org/pdf/1909.05858.pdf) for more details.",
      optional: true,
    },
    topK: {
      type: "integer",
      label: "Top K",
      description: "The number of highest probability vocabulary tokens to keep for top-k-filtering.",
      optional: true,
    },
    topP: {
      type: "string",
      label: "Top P",
      description: "If set to float < 1, only the most probable tokens with probabilities that add up to top_p or higher are kept for generation.",
      optional: true,
    },
    requestTimeout: {
      type: "integer",
      label: "Request Timeout",
      description: "The maximum time in milliseconds to wait for a response from the API.",
      optional: true,
    },
  },
  async run({ $: step }) {
    const {
      modelId,
      text,
      maxLength,
      minLength,
      maxTime,
      repetitionPenalty,
      temperature,
      topK,
      topP,
      requestTimeout,
    } = this;

    const parameters = utils.reduceProperties({
      additionalProps: {
        max_length: maxLength,
        min_length: minLength,
        max_time: maxTime,
        repetition_penalty: utils.strToFloat(repetitionPenalty),
        temperature: utils.strToFloat(temperature),
        top_k: utils.strToFloat(topK),
        top_p: utils.strToFloat(topP),
      },
    });

    const response = await this.app.inference({
      step,
      modelId,
      data: {
        inputs: text,
        parameters,
      },
      timeout: requestTimeout,
    });

    step.export("$summary", "Successfully summarized text");

    return response;
  },
};
