import { ConfigurationError } from "@pipedream/platform";
import app from "../../linkupapi.app.mjs";

export default {
  type: "action",
  key: "linkupapi-get-conversation-messages",
  name: "Get Conversation Messages",
  description: "Retrieve messages from a LinkedIn conversation. [See the documentation](https://docs.linkupapi.com/api-reference/linkup/Messages/conversation)",
  version: "0.0.1",
  props: {
    app,
    loginToken: {
      propDefinition: [
        app,
        "loginToken",
      ],
    },
    linkedinUrl: {
      propDefinition: [
        app,
        "linkedinUrl",
      ],
      optional: true,
      description: "LinkedIn URL of the other party (required if **Conversation ID** is not provided)",
    },
    conversationId: {
      propDefinition: [
        app,
        "conversationId",
        ({ loginToken }) => ({
          loginToken,
        }),
      ],
      optional: true,
      description: "LinkedIn conversation ID (required if **LinkedIn URL** is not provided)",
    },
    totalResults: {
      type: "integer",
      label: "Total Results",
      description: "Number of messages to retrieve when not in pagination mode (default: 10)",
      optional: true,
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
    idempotentHint: true,
  },
  async run({ $ }) {
    const {
      loginToken,
      linkedinUrl,
      conversationId,
      totalResults,
      country,
    } = this;

    if (!linkedinUrl && !conversationId) {
      throw new ConfigurationError("Either **LinkedIn URL** or **Conversation ID** is required");
    }

    const response = await this.app.getConversationMessages({
      $,
      data: {
        login_token: loginToken,
        linkedin_url: linkedinUrl,
        conversation_id: conversationId,
        country,
        total_results: totalResults,
      },
    });

    $.export("$summary", "Successfully retrieved conversation messages");
    return response;
  },
};
