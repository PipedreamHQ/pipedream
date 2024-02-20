import chatfai from "../../chatfai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "chaftai-get-public-character-by-id",
  name: "Get Public Character by ID",
  description: "Get a public character by ID from ChatFAI. [See the documentation](https://chatfai.com/developers/docs#tag/characters/paths/~1characters~1{id}/get)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    chatfai,
    characterId: {
      propDefinition: [
        chatfai,
        "characterId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.chatfai.getPublicCharacterById({
      characterId: this.characterId,
    });

    $.export("$summary", `Successfully retrieved character with ID ${this.characterId}`);
    return response;
  },
};
