import openai from "../../openai.app.mjs";
import common from "../common/common.mjs";
import constants from "../../common/constants.mjs";
import {
  parseArray,
  parseJson,
} from "../../common/helpers.mjs";

export default {
  ...common,
  key: "openai-chat-with-responses-api",
  name: "Chat With Responses API",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Send a chat via the Responses API, mixing built-in tools and MCP server tools. [See the documentation](https://platform.openai.com/docs/guides/tools?api-mode=responses).",
  type: "action",
  props: {
    openai,
    modelId: {
      description: "Model used to generate the response",
      propDefinition: [
        openai,
        "chatCompletionModelId",
      ],
    },
    input: {
      description: "Text input to the model used to generate a response",
      propDefinition: [
        openai,
        "input",
      ],
    },
    instructions: {
      description: "Inserts a system (or developer) message as the first item in the model's context",
      propDefinition: [
        openai,
        "instructions",
      ],
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
      description:
        "Specifies the truncation mode for the response if it exceeds the context window",
      default: "auto",
      options: [
        "auto",
        "disabled",
      ],
      optional: true,
    },
    responseFormat: {
      type: "string",
      label: "Response Format",
      description: "- `text`: Returns unstructured text output.\n- `json_schema`: Enforces a specific structure using a JSON schema.",
      options: [
        "text",
        "json_schema",
      ],
      default: "text",
      optional: true,
      reloadProps: true,
    },
    builtInTools: {
      type: "string[]",
      label: "Built-In Tools",
      description: "Which of OpenAI's first-party tools to enable (web search, file search, code interpreter).",
      options: [
        {
          label: "Web Search",
          value: "web_search_preview",
        },
        {
          label: "File Search",
          value: "file_search",
        },
        {
          label: "Code Interpreter",
          value: "code_interpreter",
        },
      ],
      default: [],
    },
    otherTools: {
      type: "string[]",
      label: "Other Tools",
      description: "Other tools to include in the chat. [See the documentation](https://platform.openai.com/docs/guides/tools-remote-mcp). Example: `{ type: \"mcp\", server_label: \"gmail\", server_url: \"https://remote.mcp.pipedream.net\", headers: {}, require_approval: \"never\" }`",
      optional: true,
    },
  },
  additionalProps() {
    if (this.responseFormat === constants.CHAT_RESPONSE_FORMAT.JSON_SCHEMA.value) {
      return {
        schemaName: {
          type: "string",
          label: "Name",
          description: "The name of the schema.",
        },
        schema: {
          type: "string",
          label: "JSON Schema",
          description: "Define the schema that the model's output must adhere to.  Only supported models are `gpt-4o-mini`, `gpt-4o-mini-2024-07-18`, `gpt-4o-2024-08-06` and later.",
        },
      };
    }
    return {};
  },
  async run({ $ }) {
    const {
      builtInTools,
      otherTools,
      modelId,
      input,
      instructions,
      previousResponseId,
      truncation,
      responseFormat,
      schemaName,
      schema,
    } = this;

    const tools = builtInTools.map((tool) => ({
      type: tool,
    }));

    if (otherTools) {
      tools.push(...parseArray(otherTools));
    }

    const data = {
      model: modelId,
      input,
      instructions,
      previous_response_id: previousResponseId,
      truncation,
      tools,
    };

    if (responseFormat === constants.CHAT_RESPONSE_FORMAT.JSON_SCHEMA.value) {
      try {
        data.text = {
          format: {
            type: responseFormat,
            name: schemaName,
            schema: parseJson(schema),
          },
        };
      } catch {
        throw new Error("Invalid JSON format in the provided JSON Schema");
      }
    }

    const response = await this.openai.responses({
      $,
      data,
      debug: true,
    });

    if (response) {
      $.export("$summary", `Successfully sent chat to OpenAI Responses API with ID \`${response.id}\`.`);
      $.export("chat_responses", response.output);
    }

    return response;
  },
};
