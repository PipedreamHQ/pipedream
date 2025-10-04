import { RESPONSE_FORMAT_TYPE_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/util.mjs";
import deepseek from "../../deepseek.app.mjs";

export default {
  key: "deepseek-create-chat-completion",
  name: "Create Chat Completion",
  description: "Creates a chat completion using the DeepSeek API. [See the documentation](https://api-docs.deepseek.com/api/create-chat-completion)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    deepseek,
    messages: {
      type: "string[]",
      label: "Messages",
      description: "The messages for the chat conversation as JSON strings. Each message should be a JSON string like '{\"role\": \"user\", \"content\": \"Hello!\"}'. [See the documentation](https://api-docs.deepseek.com/api/create-chat-completion) for further details.",
    },
    frequencyPenalty: {
      type: "string",
      label: "Frequency Penalty",
      description: "Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.",
      optional: true,
    },
    maxTokens: {
      type: "integer",
      label: "Max Tokens",
      description: "Integer between 1 and 8192. The maximum number of tokens that can be generated in the chat completion. The total length of input tokens and generated tokens is limited by the model's context length. If `max_tokens` is not specified, the default value 4096 is used.",
      optional: true,
    },
    presencePenalty: {
      type: "string",
      label: "Presence Penalty",
      description: "Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.",
      optional: true,
    },
    responseFormatType: {
      type: "string",
      label: "Response Format Type",
      description: "The format that the model must output. Setting to JSON Object enables JSON Output, which guarantees the message the model generates is valid JSON.",
      options: RESPONSE_FORMAT_TYPE_OPTIONS,
      optional: true,
    },
    stop: {
      type: "string[]",
      label: "Stop Sequences",
      description: "Up to 16 sequences where the API will stop generating further tokens.",
      optional: true,
    },
    stream: {
      type: "boolean",
      label: "Stream",
      description: "If set, partial message deltas will be sent. Tokens will be sent as data-only server-sent events (SSE) as they become available, with the stream terminated by a `data: [DONE]` message.",
      optional: true,
      reloadProps: true,
    },
    streamIncludeUsage: {
      type: "string",
      label: "Stream Include Usage",
      description: "If set, an additional chunk will be streamed before the `data: [DONE]` message. The `usage` field on this chunk shows the token usage statistics for the entire request, and the `choices` field will always be an empty array. All other chunks will also include a `usage` field, but with a null value.",
      optional: true,
      hidden: true,
    },
    temperature: {
      type: "string",
      label: "Temperature",
      description: "What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. We generally recommend altering this or Top P but not both.",
      optional: true,
    },
    topP: {
      type: "string",
      label: "Top P",
      description: "An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or Temperature but not both.",
      optional: true,
    },
    tools: {
      type: "string[]",
      label: "Tools",
      description: "A list of tools the model may call. Currently, only functions are supported as a tool. Use this to provide a list of functions the model may generate JSON inputs for. A max of 128 functions are supported.",
      optional: true,
    },
    toolChoice: {
      type: "string",
      label: "Tool Choice",
      description: "Controls which (if any) tool is called by the model. [See the documentation](https://api-docs.deepseek.com/api/create-chat-completion) for further details.",
      optional: true,
    },
    logprobs: {
      type: "boolean",
      label: "Log Probs",
      description: "Whether to return log probabilities of the output tokens or not. If true, returns the log probabilities of each output token returned in the `content` of `message`.",
      optional: true,
    },
    topLogprobs: {
      type: "string",
      label: "Top Log Probabilities",
      description: "An integer between 0 and 20 specifying the number of most likely tokens to return at each token position, each with an associated log probability. logprobs must be set to true if this parameter is used.",
      optional: true,
    },
  },
  async additionalProps(props) {
    props.streamIncludeUsage.hidden = !this.stream;
    return {};
  },
  async run({ $ }) {
    const response = await this.deepseek.createModelResponse({
      $,
      data: {
        messages: parseObject(this.messages),
        model: "deepseek-chat",
        frequency_penalty: this.frequencyPenalty && parseInt(this.frequencyPenalty),
        max_tokens: this.maxTokens,
        presence_penalty: this.presencePenalty && parseInt(this.presencePenalty),
        response_format: this.responseFormatType
          ? {
            type: this.responseFormatType,
          }
          : null,
        stop: parseObject(this.stop),
        stream: this.stream,
        stream_options: this.stream
          ? {
            include_usage: this.streamIncludeUsage,
          }
          : null,
        temperature: this.temperature && parseInt(this.temperature),
        top_p: this.topP && parseInt(this.topP),
        tools: parseObject(this.tools),
        tool_choice: parseObject(this.toolChoice),
        logprobs: this.logprobs,
        top_logprobs: this.topLogprobs && parseInt(this.topLogprobs),
      },
    });
    $.export("$summary", "Chat completion created");
    return response;
  },
};
