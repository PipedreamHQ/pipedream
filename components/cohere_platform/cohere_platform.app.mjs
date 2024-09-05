import { CohereClient } from "cohere-ai";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "cohere_platform",
  propDefinitions: {
    message: {
      type: "string",
      label: "Message",
      description: "Text input for the model to respond to. Compatible Deployments: Cohere Platform, Azure, AWS Sagemaker, Private Deployments",
    },
    model: {
      type: "string",
      label: "Model",
      description: "Defaults to `command-r-plus`. The name of a compatible [Cohere model](https://docs.cohere.com/docs/models) or the ID of a [fine-tuned](https://docs.cohere.com/docs/chat-fine-tuning) model. Compatible Deployments: Cohere Platform, Private Deployments.",
      options: constants.MODEL_OPTIONS,
      optional: true,
    },
    temperature: {
      type: "string",
      label: "Temperature",
      description: "Must be between 0 and 1.0 inclusive that tunes the degree of randomness in generation. Lower temperatures mean less random generations, and higher temperatures mean more random generations.\nRandomness can be further maximized by increasing the value of the **P** parameter. Compatible Deployments: Cohere Platform, Azure, AWS Sagemaker, Private Deployments See [Temperature](https://docs.cohere.ai/docs/temperature) for more details.",
      optional: true,
    },
    maxTokens: {
      type: "integer",
      label: "Max Tokens",
      description: "The maximum number of tokens the model will generate as part of the response. Note: Setting a low value may result in incomplete generations. Compatible Deployments: Cohere Platform, Azure, AWS Sagemaker, Private Deployments. See [BPE Tokens](https://docs.cohere.ai/docs/tokens) for more details.",
      optional: true,
    },
    k: {
      type: "integer",
      label: "K",
      description: "Ensures only the top **K** most likely tokens are considered for generation at each step. Defaults to `0`, min value of `0`, max value of `500`. Compatible Deployments: Cohere Platform, Azure, AWS Sagemaker, Private Deployments",
      min: 0,
      max: 500,
      optional: true,
    },
    p: {
      type: "string",
      label: "P",
      description: "Ensures that only the most likely tokens, with total probability mass of **P**, are considered for generation at each step. If both **K** and **P** are enabled, **P** acts after **K**. Defaults to `0.75`. min value of `0.01`, max value of `0.99`. Compatible Deployments: Cohere Platform, Azure, AWS Sagemaker, Private Deployments",
      optional: true,
    },
    stopSequences: {
      type: "string[]",
      label: "Stop Sequences",
      description: "A list of up to 5 strings that the model will use to stop generation. If the model generates a string that matches any of the strings in the list, it will stop generating tokens and return the generated text up to that point not including the stop sequence. Compatible Deployments: Cohere Platform, Azure, AWS Sagemaker, Private Deployments",
      optional: true,
    },
    frequencyPenalty: {
      type: "string",
      label: "Frequency Penalty",
      description: "Defaults to `0.0`, min value of `0.0`, max value of `1.0`. Used to reduce repetitiveness of generated tokens. The higher the value, the stronger a penalty is applied to previously present tokens, proportional to how many times they have already appeared in the prompt or prior generation. Compatible Deployments: Cohere Platform, Azure, AWS Sagemaker, Private Deployments",
      optional: true,
    },
    classifyModel: {
      type: "string",
      label: "Model",
      description: "The identifier of the model. Currently available models are `embed-multilingual-v2.0`, `embed-english-light-v2.0`, and `embed-english-v2.0` (default). Smaller light models are faster, while larger models will perform better. [Fine-tuned models](https://docs.cohere.com/docs/fine-tuning) can also be supplied with their full ID.",
      options: constants.CLASSIFY_MODEL_OPTIONS,
      optional: true,
    },
    preset: {
      type: "string",
      label: "Preset",
      description: "The ID of a custom playground preset. You can create presets in the [playground](https://dashboard.cohere.com/playground/classify?model=large). If you use a preset, all other parameters become optional, and any included parameters will override the preset's parameters.",
      optional: true,
    },
    truncate: {
      type: "string",
      label: "Truncate",
      description: "One of `NONE|START|END` to specify how the API will handle inputs longer than the maximum token length. Passing `START` will discard the start of the input. `END` will discard the end of the input. In both cases, input is discarded until the remaining input is exactly the maximum input token length for the model. If `NONE` is selected, when the input exceeds the maximum input token length an error will be returned.",
      optional: true,
      options: constants.TRUNCATE_OPTIONS,
    },
  },
  methods: {
    client() {
      return new CohereClient({
        token: this.$auth.api_key,
      });
    },
  },
};
