import app from "../../ollama.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "ollama-generate-chat-completion",
  name: "Generate Chat Completion",
  description: "Generates the next message in a chat with a provided model. [See the documentation](https://github.com/ollama/ollama/blob/main/docs/api.md#generate-a-chat-completion).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    model: {
      propDefinition: [
        app,
        "model",
      ],
    },
    messages: {
      type: "string[]",
      label: "Messages",
      description: "The messages of the chat, this can be used to keep a chat memory. Each row should be set as a JSON format string. Eg. `{\"role\": \"user\", \"content\": \"Hello\"}`. The message object has the following fields:\n- `role`: the role of the message, either `system`, `user`, `assistant`, or `tool`.\n- `content`: The content of the message.\n- `images` (optional): a list of images to include in the message (for multimodal models such as `llava`).\n- `tool_calls`(optional): a list of tools the model wants to use.",
    },
    tools: {
      type: "string[]",
      label: "Tools",
      description: "A list of tools the model can use. Each row should be set as a JSON format string.",
      optional: true,
    },
    options: {
      propDefinition: [
        app,
        "options",
      ],
    },
    stream: {
      propDefinition: [
        app,
        "stream",
      ],
    },
    keepAlive: {
      propDefinition: [
        app,
        "keepAlive",
      ],
    },
  },
  methods: {
    generateChatCompletion(args = {}) {
      return this.app.post({
        path: "/chat",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      generateChatCompletion,
      model,
      messages,
      tools,
      options,
      stream,
      keepAlive,
    } = this;

    const response = await generateChatCompletion({
      $,
      data: {
        model,
        messages: utils.parseArray(messages),
        tools: utils.parseArray(tools),
        options: utils.parseOptions(options),
        stream,
        keep_alive: keepAlive,
      },
    });

    $.export("$summary", "Successfully generated chat completion.");
    return response;
  },
};
