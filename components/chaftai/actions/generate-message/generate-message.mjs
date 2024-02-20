import chatfai from "../../chatfai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "chaftai-generate-message-reply",
  name: "Generate Message Reply",
  description: "Generates a message reply using a specified character. [See the documentation](https://chatfai.com/developers/docs#tag/chat/paths/~1chat/post)",
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
    conversation: {
      propDefinition: [
        chatfai,
        "conversation",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.chatfai.generateMessageReply({
      characterId: this.characterId,
      conversation: this.conversation.map(JSON.parse),
    });

    $.export("$summary", "Generated message reply successfully");
    return response;
  },
};
