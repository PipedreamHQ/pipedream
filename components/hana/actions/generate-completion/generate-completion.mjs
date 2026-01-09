import hana from "../../hana.app.mjs";

export default {
  key: "hana-generate-completion",
  name: "Generate Completion",
  description: "Generate a completion using the Hana API. [See the documentation](https://docs.hanabot.ai/docs/tutorial-connectors/hana-api#chat-completion)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    hana,
    role: {
      propDefinition: [
        hana,
        "role",
      ],
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the message. This is either the query from the user or the response from the assistant.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "A unique identifier for the sender. It could be the user's name (e.g., \"alex-jones\") or an identifier for the assistant (e.g., \"assistant-bot\"). Has to be hyphen separated letters only.",
    },
  },
  async run({ $ }) {
    const response = await this.hana.generateCompletion({
      $,
      data: {
        messages: [
          {
            role: this.role,
            content: this.content,
            name: this.name,
          },
        ],
      },
    });
    if (response?.content?._id) {
      $.export("$summary", `Successfully generated chat completion with ID '${response?.content?._id}'.`);
    }
    return response;
  },
};
