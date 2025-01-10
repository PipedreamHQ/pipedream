import dixa from "../../dixa.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dixa-tag-conversation",
  name: "Add Tag to Conversation",
  description: "Adds a tag to a conversation. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    dixa: {
      type: "app",
      app: "dixa",
    },
    conversationId: {
      propDefinition: [
        dixa,
        "conversationId",
      ],
    },
    tagId: {
      propDefinition: [
        dixa,
        "tagId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dixa.addTag({
      conversationId: this.conversationId,
      tagId: this.tagId,
    });
    $.export("$summary", `Added tag ${this.tagId} to conversation ${this.conversationId}`);
    return response;
  },
};
