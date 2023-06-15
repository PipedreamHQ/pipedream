import app from "../../google_palm_api.app.mjs";

export default {
  key: "google_palm_api-chat",
  name: "Chat",
  description: "Chat using Google PaLM. [See the docs here](https://developers.generativeai.google/api/python/google/generativeai/chat)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    promptText: {
      type: "string",
      label: "Prompt Text",
      description: "The text to be used as a prompt for the chat",
    },
    previousMessages: {
      type: "string[]",
      label: "Previous Messages",
      description: "The previous messages in the chat. If provided, will override the chat history",
      optional: true,
    },
    temperature: {
      type: "string",
      label: "Temperature",
      description: `The temperature to use for the chat. Values can range from [0.0,1.0], inclusive.
        A value closer to 1.0 will produce responses that are more varied and creative, while a value closer to 0.0 will typically result in more straightforward responses from the model.
        Defaults to \`0.5\``,
      optional: true,
    },
    context: {
      type: "string",
      label: "Context",
      description: "Text that should be provided to the model first, to ground the response",
      optional: true,
    },
  },
  methods: {
    async chat({
      promptText, previousMessages, temperature, context,
    }) {
      return this.app.chat({
        temperature,
        prompt: {
          context,
          messages: [
            ...previousMessages.map((message) => ({
              content: message,
            })),
            {
              content: promptText,
            },
          ],
        },
      });
    },
  },
  async run({ $ }) {
    const response = await this.chat({
      promptText: this.promptText,
      previousMessages: this.previousMessages || [],
      temperature: parseFloat(this.temperature || "0.5"),
      context: this.context,
    });
    $.export("$summary", "Successfully received response from Google PaLM");
    return response;
  },
};
