import dixa from "../../dixa.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dixa-create-conversation",
  name: "Create Conversation",
  description: "Creates a new email or contact form-based conversation. [See the documentation](https://docs.dixa.io/openapi).",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    dixa: {
      type: "app",
      app: "dixa",
    },
    subject: {
      propDefinition: [
        "dixa",
        "subject",
      ],
    },
    emailIntegrationId: {
      propDefinition: [
        "dixa",
        "emailIntegrationId",
      ],
    },
    messageType: {
      propDefinition: [
        "dixa",
        "messageType",
      ],
    },
    language: {
      propDefinition: [
        "dixa",
        "language",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.dixa.createConversation({
      subject: this.subject,
      emailIntegrationId: this.emailIntegrationId,
      messageType: this.messageType,
      language: this.language,
    });
    $.export("$summary", `Created conversation with subject: ${response.subject} and ID: ${response.id}`);
    return response;
  },
};
