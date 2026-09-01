import belco from "../../belco.app.mjs";

export default {
  key: "belco-retrieve-conversation-items",
  name: "Retrieve Conversation Items",
  description: "Retrieve the list of items (messages, notes, assignments, etc.) belonging to a conversation. [See the documentation](https://developers.belco.io/reference/get_conversations-conversationid-items)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    belco,
    conversationId: {
      propDefinition: [
        belco,
        "conversationId",
      ],
      description: "The ID of the Belco conversation to retrieve items from (e.g. `sSzxq7tMBFmCY28o8`)",
    },
  },
  async run({ $ }) {
    const response = await this.belco.getConversationItems({
      $,
      conversationId: this.conversationId,
    });

    $.export("$summary", `Successfully retrieved ${response.length} conversation item${response.length === 1
      ? ""
      : "s"}`);

    return response;
  },
};
