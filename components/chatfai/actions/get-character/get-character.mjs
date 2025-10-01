import app from "../../chatfai.app.mjs";

export default {
  key: "chatfai-get-character",
  name: "Get Public Character by ID",
  description: "Gets a public character by ID from ChatFAI. [See the documentation](https://chatfai.com/developers/docs#tag/characters/paths/~1characters~1{id}/get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
  },
  async run({ $ }) {
    const response = await this.app.getCharacter({
      $,
      id: this.characterId,
    });
    $.export("$summary", `Successfully retrieved the character with ID ${this.characterId}`);
    return response;
  },
};
