import app from "../../gpt_trainer.app.mjs";

export default {
  key: "gpt_trainer-create-chatbot",
  name: "Create Chatbot",
  description: "Creates a new chatbot that belongs to the authenticated user. [See the documentation](https://guide.gpt-trainer.com/api-reference/chatbots/create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the chatbot",
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "The prompt for the chatbot",
      optional: true,
    },
    temperature: {
      type: "string",
      label: "Temperature",
      description: "The temperature setting for the chatbot",
      optional: true,
    },
    model: {
      type: "string",
      label: "Model",
      description: "The model of the chatbot",
      optional: true,
      default: "gpt-3.5-turbo",
      options: [
        "gpt-3.5-turbo",
        "gpt-3.5-turbo-16k",
        "gpt-4",
      ],
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "The visibility of the chatbot",
      optional: true,
      default: "private",
      options: [
        "public",
        "private",
        "hybrid",
      ],
    },
    rateLimitMessage: {
      type: "string",
      label: "Rate Limit Message",
      description: "The rate limit message for the chatbot. Eg. `Too many messages in a row.`",
      optional: true,
    },
    showCitations: {
      type: "boolean",
      label: "Show Citations",
      description: "Whether the chatbot should show citations",
      optional: true,
    },
  },
  methods: {
    parseFloat(value) {
      const parsed = parseFloat(value);
      return isFinite(parsed)
        ? parsed
        : 0;
    },
    createChatbot(args = {}) {
      return this.app.post({
        path: "/chatbot/create",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createChatbot,
      parseFloat,
      name,
      prompt,
      temperature,
      model,
      visibility,
      rateLimitMessage,
      showCitations,
    } = this;

    const response = await createChatbot({
      $,
      data: {
        name,
        temperature: parseFloat(temperature),
        prompt,
        model,
        visibility,
        show_citations: showCitations,
        rate_limit_message: rateLimitMessage,
      },
    });

    $.export("$summary", `Successfully created chatbot with UUID \`${response.uuid}\`.`);
    return response;
  },
};
