import _302_ai from "../../_302_ai.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Chat using Functions",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "_302_ai-chat-using-functions",
  description: "Enable your 302.AI model to invoke user-defined functions. Useful for conditional logic, workflow orchestration, and tool invocation within conversations. [See documentation](https://doc.302.ai/211560247e0)",
  type: "action",
  props: {
    _302_ai,
    modelId: {
      propDefinition: [
        _302_ai,
        "chatCompletionModelId",
      ],
    },
    input: {
      type: "string",
      label: "Chat Input",
      description: "Text input to the model used to generate a response",
    },
    functions: {
      type: "string",
      label: "Functions",
      description: "A valid JSON array of tools/functions using the OpenAI function schema definition. Each tool must have a `type` property set to \"function\" and a `function` object with `name`, `description`, and `parameters`.",
      default:
`[
  {
    "type": "function",
    "function": {
      "name": "get_current_weather",
      "description": "Get the current weather in a given location",
      "parameters": {
        "type": "object",
        "properties": {
          "location": {
            "type": "string",
            "description": "The city and state, e.g. San Francisco, CA"
          },
          "unit": {
            "type": "string",
            "enum": ["celsius", "fahrenheit"]
          }
        },
        "required": ["location"]
      }
    }
  }
]`,
    },
    instructions: {
      type: "string",
      label: "Instructions",
      description: "System instructions for the model",
      optional: true,
    },
    toolChoice: {
      type: "string",
      label: "Tool Choice",
      description: "- **auto**: The model decides whether and how many functions to call.\n- **required**: The model must call one or more functions.\n- **function_name**: Enter a custom function name to force the model to call this specific function.",
      optional: true,
      default: "auto",
      options: [
        "auto",
        "required",
      ],
    },
    parallelToolCalls: {
      type: "string",
      label: "Parallel Function Calling",
      description: "Allow or prevent the model to call multiple functions in a single turn",
      optional: true,
      default: "1",
      options: [
        {
          label: "Enabled",
          value: "1",
        },
        {
          label: "Disabled",
          value: "0",
        },
      ],
    },
    maxTokens: {
      label: "Max Tokens",
      description: "The maximum number of tokens to generate in the completion.",
      type: "string",
      optional: true,
    },
    temperature: {
      label: "Temperature",
      description: "What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.",
      type: "string",
      optional: true,
    },
    responseFormat: {
      type: "string",
      label: "Response Format",
      description: "- **Text**: Returns unstructured text output.\n- **JSON Schema**: Enables you to define a specific structure for the model's output using a JSON schema.",
      options: [
        constants.CHAT_RESPONSE_FORMAT.TEXT.value,
        constants.CHAT_RESPONSE_FORMAT.JSON_SCHEMA.value,
      ],
      default: constants.CHAT_RESPONSE_FORMAT.TEXT.value,
      optional: true,
      reloadProps: true,
    },
  },
  additionalProps() {
    const props = {};

    if (this.responseFormat === constants.CHAT_RESPONSE_FORMAT.JSON_SCHEMA.value) {
      props.jsonSchema = {
        type: "string",
        label: "JSON Schema",
        description: "Define the schema that the model's output must adhere to.",
      };
    }

    return props;
  },
  async run({ $ }) {
    const messages = [];

    if (this.instructions) {
      messages.push({
        role: "system",
        content: this.instructions,
      });
    }

    messages.push({
      role: "user",
      content: this.input,
    });

    const data = {
      model: this.modelId,
      messages,
      parallel_tool_calls: parseInt(this.parallelToolCalls) === 1,
      tools: [],
    };

    if (this.maxTokens) {
      data.max_tokens = parseInt(this.maxTokens);
    }

    if (this.temperature) {
      data.temperature = parseFloat(this.temperature);
    }

    let functions = this.functions;
    if (typeof functions === "string") {
      try {
        functions = JSON.parse(functions);
      } catch (error) {
        throw new Error("Invalid JSON format in the provided Functions Schema");
      }
    }

    if (Array.isArray(functions)) {
      data.tools.push(...functions);
    } else {
      data.tools.push(functions);
    }

    if (this.toolChoice) {
      if (this.toolChoice === "auto" || this.toolChoice === "required") {
        data.tool_choice = this.toolChoice;
      } else {
        data.tool_choice = {
          type: "function",
          name: this.toolChoice,
        };
      }
    }

    if (this.responseFormat === constants.CHAT_RESPONSE_FORMAT.JSON_SCHEMA.value
      && this.jsonSchema) {
      try {
        data.response_format = {
          type: this.responseFormat,
          json_schema: typeof this.jsonSchema === "string"
            ? JSON.parse(this.jsonSchema)
            : this.jsonSchema,
        };
      } catch (error) {
        throw new Error("Invalid JSON format in the provided JSON Schema");
      }
    }

    const response = await this._302_ai.createChatCompletion({
      $,
      data,
    });

    if (response) {
      $.export("$summary", `Successfully sent chat with id ${response.id}`);
    }

    return response;
  },
};

