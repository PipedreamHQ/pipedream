/* eslint-disable no-unused-vars */
import app from "../../apipie_ai.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "apipie_ai-chat",
  name: "Chat",
  description: "Query LLM using text and, for vision-capable models, image data. [See the documentation](https://apipie.ai/docs/api/chatcompletions).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    maxTokens: {
      type: "integer",
      label: "Max Tokens",
      description: "Max tokens used to generate a response.",
      optional: true,
      min: 1,
    },
    type: {
      propDefinition: [
        app,
        "modelType",
      ],
    },
    subtype: {
      propDefinition: [
        app,
        "modelSubtype",
      ],
    },
    model: {
      reloadProps: true,
      type: "string[]",
      propDefinition: [
        app,
        "model",
        ({
          type, subtype,
        }) => ({
          params: {
            type,
            subtype,
            enabled: 1,
          },
        }),
      ],
    },
  },
  additionalProps() {
    const { type } = this;

    if (!type) {
      return {};
    }

    if (type === constants.MODEL_TYPE_OPTION.VISION) {
      return {
        messages: {
          type: "string[]",
          label: "Messages",
          description: "Messages for the chatbot to respond to. Each row should contain the following JSON structure as an example: `{ \"role\": \"user\", \"content\": [ { \"type\": \"text\", \"text\": \"What do you see in this image?\" }, { \"type\": \"image_url\", \"image_url\": { \"url\": \"https://ia801807.us.archive.org/22/items/test-image_202101/Test_image.jpeg\", \"detail\": \"high\" } } ] }`",
        },
      };
    }

    return {
      messages: {
        type: "string[]",
        label: "Messages",
        description: "Messages for the chatbot to respond to. Each row should contain one of the following JSON structures as an example: \n- `{ \"role\": \"user\", \"content\": \"message\" }`\n- `{ \"role\": \"assistant\", \"content\": \"message\" }`\n- `{ \"role\": \"system\", \"content\": \"message\" }`",
      },
      temperature: {
        type: "string",
        label: "Temperature",
        description: "Influences the randomness in the selection process of the next token. Lower values make the model more deterministic, while higher values increase diversity but might reduce coherence. Possible values: <= `2`.",
        optional: true,
      },
      topP: {
        type: "string",
        label: "Top P",
        description: "Controls the cumulative probability distribution cutoff, selecting the smallest set of tokens whose cumulative probability exceeds the threshold p. This focuses generation on more likely tokens, enhancing creativity and coherence. Possible values: <= `1`.",
        optional: true,
      },
      topK: {
        type: "string",
        label: "Top K",
        description: "Limits the selection pool to the top k most probable tokens. The probability distribution is then reranked among these k tokens, which helps in reducing randomness by eliminating the least likely options.",
        optional: true,
      },
      frequencyPenalty: {
        type: "string",
        label: "Frequency Penalty",
        description: "Adjusts the likelihood of a token's selection based on its previous occurrences, decreasing the chances of frequently selected tokens to promote diversity in the output. Possible values: >= `-2` and <= `2`.",
        optional: true,
      },
      presencePenalty: {
        type: "string",
        label: "Presence Penalty",
        description: "Similar to frequency penalty, but it decreases the likelihood of tokens appearing again based on their presence, regardless of frequency, to encourage novel token selection. Possible values: >= `-2` and <= `2`.",
        optional: true,
      },
      repetitionPenalty: {
        type: "string",
        label: "Repetition Penalty",
        description: "Discourages the model from repeating the same words or phrases, enhancing the uniqueness and variety of the content generated. Possible values: >= `1` and <= `2`.",
        optional: true,
      },
      n: {
        type: "integer",
        label: "N",
        description: "Receive this many responses to your prompt, currently only works with OpenAI direct",
        optional: true,
        min: 1,
        max: 5,
      },
      beamSize: {
        type: "integer",
        label: "Beam Size",
        description: "Used in beam search, it represents the number of sequences to keep at each step of the generation. A larger beam size increases the chances of finding a more optimal sequence but at the cost of computational resources and time. Only some models support this",
        optional: true,
        min: 1,
        max: 5,
      },
    };
  },
  methods: {
    chatCompletions(args = {}) {
      return this.app.post({
        path: "/chat/completions",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      chatCompletions,
      type,
      subtype,
      model,
      messages,
      ...data
    } = this;

    const response = await chatCompletions({
      $,
      data: {
        model: Array.isArray(model)
          ? model.join(",")
          : model,
        messages: utils.parseArray(messages),
        ...utils.keysToSnakeCase(data),
      },
    });

    $.export("$summary", `Successfully queried the LLM with ID \`${response.id}\`.`);
    return response;
  },
};
