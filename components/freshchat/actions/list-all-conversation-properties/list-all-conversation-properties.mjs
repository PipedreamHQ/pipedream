import freshchat from "../../freshchat.app.mjs";

export default {
  key: "freshchat-list-all-conversation-properties",
  name: "List All Conversation Properties",
  description: "Retrieves a list of all conversation properties configured in the Freshchat system. [See the documentation](https://developers.freshchat.com/api/#list_all_conversation_properties)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    freshchat,
  },
  async run({ $ }) {
    const response = await this.freshchat.listConversationProperties({
      $,
    });
    $.export("$summary", `Retrieved ${response.length} conversation propert${response.length === 1
      ? "y"
      : "ies"}`);
    return response;
  },
};
