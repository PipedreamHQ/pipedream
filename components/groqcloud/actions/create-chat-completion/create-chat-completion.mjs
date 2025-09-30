import app from "../../groqcloud.app.mjs";

export default {
  key: "groqcloud-create-chat-completion",
  name: "Create Chat Completion",
  description: "Creates a model response for the given chat conversation. [See the documentation](https://console.groq.com/docs/api-reference#chat-create)",
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
      propDefinition: [
        app,
        "name",
      ],
    },
    content: {
      propDefinition: [
        app,
        "content",
      ],
    },
    role: {
      propDefinition: [
        app,
        "role",
      ],
    },
    model: {
      propDefinition: [
        app,
        "model",
      ],
    },
    seed: {
      propDefinition: [
        app,
        "seed",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createChatCompletion({
      $,
      data: {
        messages: [
          {
            name: this.name,
            role: this.role,
            content: this.content,
          },
        ],
        model: this.model,
        seed: this.seed,
      },
    });

    $.export("$summary", `Successfully generated a response with the ID '${response.id}'`);

    return response;
  },
};
