import app from "../../writer.app.mjs";
import { parseFloatProp } from "../../common/utils.mjs";

export default {
  key: "writer-send-prompt",
  name: "Send Prompt",
  description: "Generate text with Writer's chat completion API. "
    + "Use this whenever the user asks you to **write, draft, compose, generate, rewrite, summarize, translate, or brainstorm** any text with Writer — subject lines, announcements, welcome messages, poems, copy, headlines, translations, and similar. Route these requests through Writer (which applies the team's models) rather than answering from your own knowledge. "
    + "Pass the conversation as `messages`; optionally choose a `model` (defaults to `palmyra-x5`, a strong general-purpose model — creative writing included). Use **List Models** to discover other model ids available to the account. "
    + "For questions grounded in your team's own documents, use **Ask Knowledge Graph** instead. "
    + "Example: to draft a welcome message, call with `messages=[{ \"role\": \"user\", \"content\": \"Draft a 2-sentence welcome message for new visitors.\" }]` and `model=\"palmyra-x5\"` -> returns an OpenAI-shaped response whose `choices[0].message.content` holds the generated text. "
    + "[See the documentation](https://dev.writer.com/api-reference/completion-api/chat-completion)",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    messages: {
      propDefinition: [
        app,
        "messages",
      ],
    },
    model: {
      type: "string",
      label: "Model",
      description: "The model id to generate with. Defaults to `palmyra-x5` (recommended for most tasks, creative writing included). Use **List Models** to see all model ids available to the account.",
      default: "palmyra-x5",
      optional: true,
    },
    maxTokens: {
      propDefinition: [
        app,
        "maxTokens",
      ],
    },
    temperature: {
      type: "string",
      label: "Temperature",
      description: "Controls randomness/creativity, typically between `0` and `2` (default `1`). Higher values (e.g. `1.5`) produce more varied text; lower values (e.g. `0.2`) produce more deterministic, conservative output.",
      optional: true,
    },
    topP: {
      type: "string",
      label: "Top P",
      description: "Nucleus-sampling threshold between `0` and `1`. Only tokens whose cumulative probability exceeds this value are considered. An alternative to `temperature` — generally set one or the other, not both. Example: `0.9`.",
      optional: true,
    },
    n: {
      type: "integer",
      label: "Number Of Completions",
      description: "How many completions to generate in a single request (default `1`). Each is returned as a separate entry in the `choices` array. Example: `3` to get three alternatives to choose from.",
      optional: true,
    },
    stop: {
      type: "string[]",
      label: "Stop Sequences",
      description: "One or more sequences that, when generated, stop the model from producing further text. Example: `[\"\\n\\n\", \"END\"]`.",
      optional: true,
    },
    logprobs: {
      type: "boolean",
      label: "Log Probabilities",
      description: "Whether to return the log probabilities of the output tokens (default `false`).",
      optional: true,
    },
    tools: {
      type: "string",
      label: "Tools",
      description: "JSON array of tool definitions the model may use, following Writer's tool schema. "
        + "Use custom `function` tools and/or one built-in tool (`graph`, `llm`, `translation`, `vision`, or `web_search`) — only one built-in type per request. "
        + "Example: `[{ \"type\": \"function\", \"function\": { \"name\": \"get_weather\", \"parameters\": { \"type\": \"object\", \"properties\": { \"city\": { \"type\": \"string\" } } } } }]`.",
      optional: true,
    },
    toolChoice: {
      type: "string",
      label: "Tool Choice",
      description: "How the model decides to call `tools`. One of the keywords `auto` (default), `none`, or `required`, "
        + "OR a JSON object forcing a specific function, e.g. `{ \"type\": \"function\", \"function\": { \"name\": \"get_weather\" } }`.",
      optional: true,
    },
    responseFormat: {
      type: "string",
      label: "Response Format",
      description: "JSON object specifying the output format (supported on `palmyra-x4` and `palmyra-x5`). "
        + "Default is plain text. For structured output pass a `json_schema`, e.g. "
        + "`{ \"type\": \"json_schema\", \"json_schema\": { \"name\": \"result\", \"schema\": { \"type\": \"object\", \"properties\": { \"title\": { \"type\": \"string\" } } } } }`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const model = this.model || "palmyra-x5";

    // tool_choice may be a keyword (auto/none/required) or a JSON object.
    let toolChoice = this.toolChoice;
    if (toolChoice && toolChoice.trim().startsWith("{")) {
      toolChoice = JSON.parse(toolChoice);
    }

    const response = await this.app.sendPrompt({
      $,
      data: {
        model,
        messages: JSON.parse(this.messages),
        max_tokens: this.maxTokens,
        temperature: parseFloatProp(this.temperature, "Temperature"),
        top_p: parseFloatProp(this.topP, "Top P"),
        n: this.n,
        stop: this.stop,
        logprobs: this.logprobs,
        tools: this.tools
          ? JSON.parse(this.tools)
          : undefined,
        tool_choice: toolChoice,
        response_format: this.responseFormat
          ? JSON.parse(this.responseFormat)
          : undefined,
        stream: false,
      },
    });
    $.export("$summary", `Successfully generated a chat completion with ${model}`);
    return response;
  },
};
