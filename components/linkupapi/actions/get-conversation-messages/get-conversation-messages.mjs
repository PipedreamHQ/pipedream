import { ConfigurationError } from "@pipedream/platform";
import app from "../../linkupapi.app.mjs";

export default {
  type: "action",
  key: "linkupapi-get-conversation-messages",
  name: "Get Conversation Messages",
  description: "Retrieve messages from a LinkedIn conversation. Identify the conversation by its ID or by the recipient's profile URL. [See the documentation](https://docs.linkupapi.com/api-reference/v2/messages/get-conversation)",
  version: "1.0.0",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
    conversationId: {
      propDefinition: [
        app,
        "conversationId",
      ],
      optional: true,
      description: "LinkedIn conversation identifier. Provide this or a **LinkedIn URL**. Pick from your inbox, or run **List Inbox** to find one.",
    },
    linkedinUrl: {
      propDefinition: [
        app,
        "linkedinUrl",
      ],
      description: "LinkedIn profile URL of the other participant; the conversation with that user is resolved automatically. Provide this or a **Conversation ID**.",
      optional: true,
    },
    totalResults: {
      propDefinition: [
        app,
        "totalResults",
      ],
    },
  },
  async run({ $ }) {
    if (!this.conversationId && !this.linkedinUrl) {
      throw new ConfigurationError("Provide a **Conversation ID** or a **LinkedIn URL** to identify the conversation.");
    }
    const messages = await this.app._paginate({
      max: this.totalResults,
      requestPage: ({
        next, count,
      }) => this.app.getConversationMessages({
        $,
        accountId: this.accountId,
        params: {
          conversation_id: this.conversationId,
          profile_url: this.linkedinUrl,
          count,
          cursor: next,
        },
      }),
      getItems: (res) => res.data?.messages,
      getNext: (res) => res.data?.next_cursor,
    });

    $.export("$summary", `Successfully retrieved ${messages.length} message${messages.length === 1
      ? ""
      : "s"} for conversation ${this.conversationId || this.linkedinUrl}`);
    return messages;
  },
};
