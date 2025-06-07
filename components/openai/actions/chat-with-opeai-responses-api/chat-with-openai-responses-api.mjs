import openai from "../../openai.app.mjs";
import common from "../common/common.mjs";
import constants from "../../common/constants.mjs";
import axios from "axios";

export default {
  ...common,
  key: "openai-chat-using-responses-api",
  name: "Chat with OpenAI Responses API",
  version: "0.0.1",
  description:
    "Send a chat via the Responses API, mixing built-in tools and MCP servers.",
  type: "action",
  props: {
    openai,
    modelId: {
      type: "string",
      label: "Model",
      description: "Model used to generate the response",
      default: "gpt-4o",
      options: [
        "gpt-4o",
        "gpt-4o-mini",
      ],
    },
    input: {
      type: "string",
      label: "Chat Input",
      description: "Text input to the model used to generate a response",
    },
    instructions: {
      type: "string",
      label: "Instructions",
      description:
        "Inserts a system (or developer) message as the first item in the model's context",
      optional: true,
    },
    previousResponseId: {
      type: "string",
      label: "Previous Response ID",
      description:
        "The unique ID of the previous response to the model. Use this to create multi-turn conversations",
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
      description:
        "- **text**: Returns unstructured text output.\n- **json_schema**: Enforces a specific structure using a JSON schema.",
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
      description:
        "Pass in a boolean custom expression to skip execution at runtime",
      default: false,
      optional: true,
    },
    builtInTools: {
      type: "string[]",
      label: "Built-In Tools",
      description:
        "Which of OpenAI’s first-party tools to enable (web search, file search, code interpreter).",
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
    mcpServers: {
      type: "string[]",
      label: "MCP Server URLs",
      description:
        "Enter your MCP server base URLs. To set one up, visit https://mcp.pipedream.com/ and click “Create new server.",
      optional: true,
    },
    mcpTools: {
      type: "string[]",
      label: "MCP Tools to Enable",
      description:
        "Select which tools from your MCP servers to include in the chat.",
      optional: true,
      async options({ mcpServers }) {
        if (!mcpServers?.length) return [];
        const all = [];
        for (let url of mcpServers) {
          url = url.replace(/\/$/, "");
          const { data } = await axios.get(`${url}/tools`);
          for (const t of data.tools) {
            all.push({
              label: t.name,
              value: t.id,
            });
          }
        }
        return all;
      },
    },
  },
  additionalProps() {
    const props = {};
    if (
      this.responseFormat ===
      constants.CHAT_RESPONSE_FORMAT.JSON_SCHEMA.value
    ) {
      props.jsonSchema = {
        type: "string",
        label: "JSON Schema",
        description:
          "Define the schema that the model's output must adhere to.",
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
    const tools = [];
    for (const id of this.builtInTools) {
      tools.push({
        type: id,
      });
    }
    for (const id of this.mcpTools || []) {
      tools.push({
        type: id,
      });
    }
    const data = {
      model: this.modelId,
      input: this.input,
      instructions: this.instructions,
      previous_response_id: this.previousResponseId,
      truncation: this.truncation,
      tools,
    };
    if (
      this.responseFormat ===
      constants.CHAT_RESPONSE_FORMAT.JSON_SCHEMA.value
    ) {
      try {
        data.text = {
          format: {
            type: this.responseFormat,
            ...JSON.parse(this.jsonSchema),
          },
        };
      } catch {
        throw new Error("Invalid JSON format in the provided JSON Schema");
      }
    }
    const response = await this.openai.responses({
      $,
      data,
    });
    if (response) {
      $.export("$summary", `Chat sent (id: ${response.id})`);
      $.export("chat_responses", response.output);
    }
    return response;
  },
};
