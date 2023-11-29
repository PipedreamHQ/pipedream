import bot9 from "../../bot9.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "bot9-init-chat",
  name: "Initiate Chat",
  description: "Initiates a new conversation with a Bot9 chatbot. [See the documentation](https://bot9ai.apimatic.dev/v/1_0)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    bot9,
    chatbotId: {
      propDefinition: [
        bot9,
        "chatbotId",
      ],
    },
    source: {
      propDefinition: [
        bot9,
        "source",
      ],
    },
    status: {
      propDefinition: [
        bot9,
        "status",
      ],
    },
    externalSessionId: {
      propDefinition: [
        bot9,
        "externalSessionId",
      ],
    },
    userName: {
      propDefinition: [
        bot9,
        "userName",
      ],
    },
    externalId: {
      propDefinition: [
        bot9,
        "externalId",
      ],
    },
    emailId: {
      propDefinition: [
        bot9,
        "emailId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bot9._makeRequest({
      method: "POST",
      path: `/${this.chatbotId}/conversations`,
      data: {
        Source: this.source,
        Status: this.status,
        ExternalSessionId: this.externalSessionId,
        user: {
          name: this.userName,
          externalId: this.externalId,
          emailId: this.emailId,
        },
      },
    });

    $.export("$summary", `Successfully initiated conversation with ID: ${response.id}`);
    return response;
  },
};
