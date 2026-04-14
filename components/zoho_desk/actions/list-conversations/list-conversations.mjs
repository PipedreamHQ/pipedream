import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-list-conversations",
  name: "List Conversations",
  description: "List all conversations for a ticket. [See the documentation](https://desk.zoho.com/DeskAPIDocument#Threads#Threads_Listconversations)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zohoDesk,
    orgId: {
      propDefinition: [
        zohoDesk,
        "orgId",
      ],
    },
    ticketId: {
      propDefinition: [
        zohoDesk,
        "ticketId",
        ({ orgId }) => ({
          orgId,
        }),
      ],
    },
    maxResults: {
      propDefinition: [
        zohoDesk,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const results = this.zohoDesk.getResourcesStream({
      resourceFn: this.zohoDesk.getConversations,
      resourceFnArgs: {
        $,
        ticketId: this.ticketId,
        headers: {
          orgId: this.orgId,
        },
      },
      max: this.maxResults,
    });

    const conversations = [];
    for await (const conversation of results) {
      conversations.push(conversation);
    }

    $.export("$summary", `Successfully listed ${conversations.length} conversation${conversations.length === 1
      ? ""
      : "s"}`);
    return conversations;
  },
};
