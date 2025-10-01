import app from "../../chatfai.app.mjs";

export default {
  key: "chatfai-generate-message",
  name: "Generate Message Reply",
  description: "Generates a message reply using a ChatFAI character. [See the documentation](https://chatfai.com/developers/docs#tag/Chat/paths/~1chat/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    characterId: {
      propDefinition: [
        app,
        "characterId",
      ],
    },
    content: {
      propDefinition: [
        app,
        "content",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    bio: {
      propDefinition: [
        app,
        "bio",
      ],
    },
    useInternalOptimizations: {
      propDefinition: [
        app,
        "useInternalOptimizations",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.generateMessage({
      $,
      data: {
        character_id: this.characterId,
        conversation: [
          {
            content: this.content,
          },
        ],
        name: this.name,
        bio: this.bio,
        use_internal_optimizations: this.useInternalOptimizations,
      },
    });
    $.export("$summary", "Generated a message reply successfully");
    return response;
  },
};
