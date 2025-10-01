import helpScout from "../../help_scout.app.mjs";

export default {
  key: "help_scout-get-conversation-threads",
  name: "Get Conversation Threads",
  description: "Retrieves the threads of a specific conversation. [See the documentation](https://developer.helpscout.com/mailbox-api/endpoints/conversations/threads/list/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    helpScout,
    conversationId: {
      propDefinition: [
        helpScout,
        "conversationId",
      ],
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number to retrieve. By default, the 25 most recent threads are retrieved (page 1)",
      optional: true,
      default: 1,
      min: 1,
    },
  },
  async run({ $ }) {
    const response = await this.helpScout.getConversationThreads({
      $,
      conversationId: this.conversationId,
      params: {
        page: this.page,
      },
    });

    const threads = response?._embedded?.threads;
    const pageInfo = response?.page;

    $.export("$summary", `Successfully retrieved ${threads?.length || 0} threads for conversation ID: ${this.conversationId} (Page ${pageInfo?.number + 1 || this.page} of ${pageInfo?.totalPages || "unknown"})`);
    return {
      threads,
      pagination: pageInfo,
    };
  },
};
