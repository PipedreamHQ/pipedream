import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";
import apipieAi from "../../apipie_ai.app.mjs";

export default {
  key: "apipie_ai-send-chat-completion-request",
  name: "Send Chat Completion Request",
  version: "0.0.1",
  description: "Send a chat completion request to a selected LLM model. [See the dashboard](https://apipie.ai/dashboard)",
  type: "action",
  props: {
    apipieAi,
    model: {
      propDefinition: [
        apipieAi,
        "chatCompletionModelId",
      ],
    },
    messages: {
      type: "string[]",
      label: "Messages",
      description: "A list of objects containing role and content. E.g. **{\"role\":\"user\", \"content\":\"text\"}**. [See the documentation](https://apipie.ai/docs/Features/Completions) for further details.",
    },
    maxTokens: {
      propDefinition: [
        apipieAi,
        "maxTokens",
      ],
    },
    temperature: {
      propDefinition: [
        apipieAi,
        "temperature",
      ],
    },
    seed: {
      propDefinition: [
        apipieAi,
        "seed",
      ],
    },
    topP: {
      propDefinition: [
        apipieAi,
        "topP",
      ],
    },
    topK: {
      propDefinition: [
        apipieAi,
        "topK",
      ],
    },
    frequencyPenalty: {
      propDefinition: [
        apipieAi,
        "frequencyPenalty",
      ],
    },
    presencePenalty: {
      propDefinition: [
        apipieAi,
        "presencePenalty",
      ],
    },
    repetitionPenalty: {
      propDefinition: [
        apipieAi,
        "repetitionPenalty",
      ],
    },
    reasoningEffort: {
      propDefinition: [
        apipieAi,
        "reasoningEffort",
      ],
    },
    toolTypes: {
      type: "string[]",
      label: "Tool Types",
      description: "The types of tools to enable on the assistant",
      options: constants.TOOL_TYPES?.filter((toolType) => toolType === "function") || ["function"],
      optional: true,
      reloadProps: true,
    },
  },
  additionalProps() {
    const {
      toolTypes,
      numberOfFunctions,
    } = this;
    const props = {};

    if (toolTypes?.includes("function")) {
      props.numberOfFunctions = {
        type: "integer",
        label: "Number of Functions",
        description: "The number of functions to define",
        optional: true,
        reloadProps: true,
        default: 1,
      };

      for (let i = 0; i < (numberOfFunctions || 1); i++) {
        props[`functionName_${i}`] = {
          type: "string",
          label: `Function Name ${i + 1}`,
          description: "The name of the function to be called. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64.",
        };
        props[`functionDescription_${i}`] = {
          type: "string",
          label: `Function Description ${i + 1}`,
          description: "A description of what the function does, used by the model to choose when and how to call the function.",
          optional: true,
        };
        props[`functionParameters_${i}`] = {
          type: "object",
          label: `Function Parameters ${i + 1}`,
          description: "The parameters the functions accepts, described as a JSON Schema object. See the [guide](https://platform.openai.com/docs/guides/text-generation/function-calling) for examples, and the [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for documentation about the format.",
          optional: true,
        };
      }
    }

    return props;
  },
  methods: {
    _buildTools() {
      const tools = [];
      
      if (this.toolTypes?.includes("function")) {
        const numberOfFunctions = this.numberOfFunctions || 1;
        for (let i = 0; i < numberOfFunctions; i++) {
          if (this[`functionName_${i}`]) {
            tools.push({
              type: "function",
              function: {
                name: this[`functionName_${i}`],
                description: this[`functionDescription_${i}`],
                parameters: this[`functionParameters_${i}`],
              },
            });
          }
        }
      }
      
      return tools.length ? tools : undefined;
    },
  },
  async run({ $ }) {
    try {
      const data = {
        model: this.model,
        messages: parseObject(this.messages),
        stream: false,
      };

      // Add optional parameters only if they exist
      if (this.maxTokens) data.max_tokens = this.maxTokens;
      if (this.temperature) data.temperature = this.temperature;
      if (this.seed) data.seed = this.seed;
      if (this.topP) data.top_p = this.topP;
      if (this.topK) data.top_k = this.topK;
      if (this.frequencyPenalty) data.frequency_penalty = this.frequencyPenalty;
      if (this.presencePenalty) data.presence_penalty = this.presencePenalty;
      if (this.repetitionPenalty) data.repetition_penalty = this.repetitionPenalty;
      if (this.reasoningEffort) data.reasoning_effort = this.reasoningEffort;

      // Add tools if they exist
      const tools = this._buildTools();
      if (tools) data.tools = tools;

      const response = await this.apipieAi.sendChatCompletionRequest({
        $,
        data,
        timeout: 1000 * 60 * 5,
      });
      if (response.error) {
        $.export("Error creating Chat Completion", response.error);
        throw new ConfigurationError(response.error.message || "Failed to create Chat Completion");
      }

      $.export("$summary", `A new chat completion request with Id: ${response.id} was successfully created!`);
      return response;
    } catch (e) {
      $.export("Error creating Chat Completion", e);
      throw new ConfigurationError(e.message || "Failed to create Chat Completion");
    }
  },
};
