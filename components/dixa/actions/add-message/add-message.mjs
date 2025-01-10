import dixa from "../../dixa.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dixa-add-message",
  name: "Add Message to Conversation",
  description: "Adds a message to an existing conversation. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    dixa,
    conversationId: {
      propDefinition: [
        dixa,
        "conversationId",
      ],
    },
    attachments: {
      propDefinition: [
        dixa,
        "attachments",
      ],
      optional: true,
    },
    content: {
      propDefinition: [
        dixa,
        "content",
      ],
      optional: true,
    },
    externalId: {
      propDefinition: [
        dixa,
        "externalId",
      ],
      optional: true,
    },
    integrationEmail: {
      propDefinition: [
        dixa,
        "integrationEmail",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.dixa.addMessage({
      conversationId: this.conversationId,
      attachments: this.attachments,
      content: this.content,
      externalId: this.externalId,
      integrationEmail: this.integrationEmail,
    });
    $.export("$summary", `Added message to conversation ${this.conversationId}`);
    return response;
  },
};
