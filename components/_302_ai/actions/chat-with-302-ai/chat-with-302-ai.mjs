import _302_ai from "../../_302_ai.app.mjs";
import common from "../common/common.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  name: "Chat with 302.AI",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "_302_ai-chat-with-302-ai",
  description: "Send a message to the 302.AI Chat API. Ideal for dynamic conversations, contextual assistance, and creative generation. [See documentation](https://doc.302.ai/147522039e0)",
  type: "action",
  props: {
    _302_ai,
    modelId: {
      propDefinition: [
        _302_ai,
        "chatCompletionModelId",
      ],
    },
    userMessage: {
      label: "User Message",
      type: "string",
      description: "The user message to send to the model",
    },
    ...common.props,
    systemInstructions: {
      label: "System Instructions",
      type: "string",
      description: "The system message helps set the behavior of the assistant. For example: \"You are a helpful assistant.\"",
      optional: true,
    },
    messages: {
      label: "Prior Message History",
      type: "string[]",
      description: "Because the models have no memory of past chat requests, all relevant information must be supplied via the conversation. You can provide an array of messages from prior conversations here. **Formats supported:** 1) Plain strings with role prefix (e.g., `User: Hello` or `Assistant: Hi there`), 2) JSON strings (e.g., `{\"role\": \"user\", \"content\": \"Hello\"}`), 3) Plain strings without prefix (defaults to user role).",
      optional: true,
    },
    responseFormat: {
      type: "string",
      label: "Response Format",
      description: "- **Text**: Returns unstructured text output.\n- **JSON Object**: Returns a JSON object.\n- **JSON Schema**: Enables you to define a specific structure for the model's output using a JSON schema.",
      options: Object.values(constants.CHAT_RESPONSE_FORMAT).map((format) => format.value),
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
        description: "Define the schema that the model's output must adhere to. Must be a valid JSON schema object.",
      };
    }
    return props;
  },
  async run({ $ }) {
    let messages = [];

    if (this.messages && this.messages.length) {
      for (const message of this.messages) {
        let parsed;

        if (typeof message === "string") {
          // Try to parse as JSON first
          try {
            parsed = JSON.parse(message);
          } catch {
            // If not JSON, treat as a plain string and infer role from content
            // Check if message starts with "User:" or "Assistant:" or "System:"
            if (message.toLowerCase().startsWith("user:")) {
              parsed = {
                role: "user",
                content: message.replace(/^user:\s*/i, "").trim(),
              };
            } else if (message.toLowerCase().startsWith("assistant:")) {
              parsed = {
                role: "assistant",
                content: message.replace(/^assistant:\s*/i, "").trim(),
              };
            } else if (message.toLowerCase().startsWith("system:")) {
              parsed = {
                role: "system",
                content: message.replace(/^system:\s*/i, "").trim(),
              };
            } else {
              // Default to user role if no prefix
              parsed = {
                role: "user",
                content: message,
              };
            }
          }
        } else {
          parsed = message;
        }

        messages.push(parsed);
      }
    } else {
      if (this.systemInstructions) {
        messages.push({
          "role": "system",
          "content": this.systemInstructions,
        });
      }
    }

    messages.push({
      "role": "user",
      "content": this.userMessage,
    });

    const responseFormat = this.responseFormat ===
      constants.CHAT_RESPONSE_FORMAT.JSON_SCHEMA.value && this.jsonSchema
      ? {
        response_format: {
          type: this.responseFormat,
          json_schema: typeof this.jsonSchema === "string"
            ? JSON.parse(this.jsonSchema)
            : this.jsonSchema,
        },
      }
      : this.responseFormat && this.responseFormat !== constants.CHAT_RESPONSE_FORMAT.TEXT.value
        ? {
          response_format: {
            type: this.responseFormat,
          },
        }
        : {};

    const data = {
      ...this._getCommonArgs(),
      ...responseFormat,
      messages,
    };

    const response = await this._302_ai.createChatCompletion({
      $,
      data,
    });

    if (this.responseFormat === constants.CHAT_RESPONSE_FORMAT.JSON_SCHEMA.value) {
      for (const choice of response.choices) {
        try {
          choice.message.content = JSON.parse(choice.message.content);
        } catch {
          console.log(`Unable to parse JSON: ${choice.message.content}`);
        }
      }
    }

    if (response) {
      $.export("$summary", `Successfully sent chat with id ${response.id}`);
    }

    return {
      original_messages: messages,
      original_messages_with_assistant_response: messages.concat(response.choices[0]?.message),
      ...response,
    };
  },
};

