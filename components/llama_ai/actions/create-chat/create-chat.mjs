import utils from "../../common/utils.mjs";
import app from "../../llama_ai.app.mjs";

export default {
  key: "llama_ai-create-chat",
  name: "Create Chat",
  description: "Creates a new chat. [See the documentation](https://docs.llama-api.com/api-reference/endpoint/create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    messages: {
      type: "string[]",
      label: "Messages",
      description: "A collection of messages that form the ongoing conversation. Each message should be a JSON string.",
    },
    functions: {
      type: "string[]",
      label: "Functions",
      description: "A list of functions for which the model can generate JSON inputs. Each function should be a JSON string.",
      optional: true,
    },
    stream: {
      type: "boolean",
      label: "Stream",
      description: "When this option is enabled, the model will send partial message updates, similar to ChatGPT. Tokens will be transmitted as data-only server-sent events as they become available, and the streaming will conclude with a data: [DONE] marker.",
      optional: true,
    },
    functionCall: {
      type: "string",
      label: "Function Call",
      description: "This parameter governs the model's response to function calls. Choosing \"none\" indicates that the model will not invoke any functions and will respond directly to the end-user.",
      optional: true,
    },
  },
  methods: {
    createChat(args = {}) {
      return this.app.post({
        path: "/chat/completions",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createChat,
      messages,
      functions,
      stream,
      functionCall,
    } = this;

    const response = await createChat({
      $,
      data: {
        messages: utils.parseArray(messages),
        functions: utils.parseArray(functions),
        stream,
        function_call: functionCall,
      },
    });

    $.export("$summary", `Successfully created a new chat with \`${response.choices.length}\` choice(s)`);
    return response;
  },
};
