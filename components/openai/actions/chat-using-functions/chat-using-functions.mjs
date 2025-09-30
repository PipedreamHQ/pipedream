import openai from "../../openai.app.mjs";
import common from "../common/common.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  name: "Chat using Functions",
  version: "0.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "openai-chat-using-functions",
  description: "Chat with your models and allow them to invoke functions. Optionally, you can build and invoke workflows as functions. [See the documentation](https://platform.openai.com/docs/guides/function-calling)",
  type: "action",
  props: {
    openai,
    alert: {
      type: "alert",
      alertType: "info",
      content: "Provide function names and parameters, and the model will either answer the question directly or decide to invoke one of the functions, returning a function call that adheres to your specified schema. Add a custom code step that includes all available functions which can be invoked based on the model's response - [you can even build an entire workflow as a function](https://pipedream.com/docs/workflows/building-workflows/code/nodejs/#invoke-another-workflow)! Once the appropriate function or workflow is executed, continue the overall execution or pass the result back to the model for further analysis. For more details, [see this guide](https://platform.openai.com/docs/guides/function-calling?api-mode=responses#overview) and this [walkthrough](https://pipedream.com/blog/introducing-enhanced-openai-chat-actions-for-pipedream/#using-pipedream-workflows-as-functions).",
    },
    modelId: {
      propDefinition: [
        openai,
        "chatCompletionModelId",
      ],
    },
    input: {
      type: "string",
      label: "Chat Input",
      description: "Text inputs to the model used to generate a response",
    },
    functions: {
      type: "string",
      label: "Functions",
      description: "A valid JSON array of functions using OpenAI's function schema definition. [See guide here](https://platform.openai.com/docs/guides/function-calling?api-mode=responses&example=search-knowledge-base#defining-functions).",
      default:
`[
  {
    "type": "function",
    "name": "your_function_name",
    "description": "Details on when and how to use the function",
    "strict": true,
    "parameters": {
      "type": "object",
      "properties": {
        "property_name": {
          "type": "property_type",
          "description": "A description for this property"
        },
        "another_property_name": {
          "type": "property_type",
          "description": "A description for this property"
        }
      },
      "required": [
        "list",
        "of",
        "required",
        "properties",
        "for",
        "this",
        "object"
      ],
      "additionalProperties": false
    }
  }
]`,
    },
    instructions: {
      type: "string",
      label: "Instructions",
      description: "Inserts a system (or developer) message as the first item in the model's context",
      optional: true,
    },
    toolChoice: {
      type: "string",
      label: "Tool Choice",
      description: "- **auto**: The model decides whether and how many functions to call.\n- **required**: The model must call one or more functions.\n- **function_name**: Enter a custom expression to force the model to call this specific function.",
      optional: true,
      default: "auto",
      options: [
        "auto",
        "required",
      ],
    },
    parallelToolCalls: {
      type: "boolean",
      label: "Parallel Function Calling",
      description: "Allow or prevent the model to call multiple functions in a single turn",
      optional: true,
      default: true,
    },
    previousResponseId: {
      type: "string",
      label: "Previous Response ID",
      description: "The unique ID of the previous response to the model. Use this to create multi-turn conversations",
      optional: true,
    },
    truncation: {
      type: "string",
      label: "Truncation",
      description: "Specifies the truncation mode for the response if it's larger than the context window size",
      optional: true,
      default: "auto",
      options: [
        "auto",
        "disabled",
      ],
    },
    responseFormat: {
      type: "string",
      label: "Response Format",
      description: "- **Text**: Returns unstructured text output.\n- **JSON Schema**: Enables you to define a [specific structure for the model's output using a JSON schema](https://platform.openai.com/docs/guides/structured-outputs?api-mode=responses).",
      options: [
        "text",
        "json_schema",
      ],
      default: "text",
      optional: true,
      reloadProps: true,
    },
    skipThisStep: {
      type: "boolean",
      label: "Skip This Step",
      description: "Pass in a boolean custom expression to skip this step's execution at runtime",
      optional: true,
      default: false,
    },
  },
  additionalProps() {
    const {
      modelId,
      responseFormat,
    } = this;
    const props = {};

    if (this.openai.isReasoningModel(modelId)) {
      props.reasoningEffort = {
        type: "string",
        label: "Reasoning Effort",
        description: "Constrains effort on reasoning for reasoning models",
        optional: true,
        options: [
          "low",
          "medium",
          "high",
        ],
      };

      // aparrently not supported yet as of 12/march/2025
      // props.generateSummary = {
      //   type: "string",
      //   label: "Generate Reasoning Summary",
      //   description: "A summary of the reasoning performed by the model",
      //   optional: true,
      //   options: [
      //     "concise",
      //     "detailed",
      //   ],
      // };
    }

    if (responseFormat === constants.CHAT_RESPONSE_FORMAT.JSON_SCHEMA.value) {
      props.jsonSchema = {
        type: "string",
        label: "JSON Schema",
        description: "Define the schema that the model's output must adhere to. [Generate one here](https://platform.openai.com/docs/guides/structured-outputs/supported-schemas).",
      };
    }

    return props;
  },
  methods: {
    ...common.methods,
  },
  async run({ $ }) {
    if (this.skipThisStep) {
      $.export("$summary", "Step execution skipped");
      return;
    }

    const data = {
      model: this.modelId,
      input: this.input,
      instructions: this.instructions,
      previous_response_id: this.previousResponseId,
      truncation: this.truncation,
      parallel_tool_calls: this.parallelToolCalls,
      tools: [],
    };

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

    if (this.openai.isReasoningModel(this.modelId) && this.reasoningEffort) {
      data.reasoning = {
        ...data.reasoning,
        effort: this.reasoningEffort,
      };
    }

    if (this.openai.isReasoningModel(this.modelId) && this.generateSummary) {
      data.reasoning = {
        ...data.reasoning,
        generate_summary: this.generateSummary,
      };
    }

    if (this.responseFormat === constants.CHAT_RESPONSE_FORMAT.JSON_SCHEMA.value) {
      try {
        data.text = {
          format: {
            type: this.responseFormat,
            ...JSON.parse(this.jsonSchema),
          },
        };
      } catch (error) {
        throw new Error("Invalid JSON format in the provided JSON Schema");
      }
    }

    const response = await this.openai.responses({
      $,
      data,
    });

    if (response) {
      $.export("$summary", `Successfully sent chat with id ${response.id}`);
      $.export("chat_responses", response.output);
    }

    return response;
  },
};
