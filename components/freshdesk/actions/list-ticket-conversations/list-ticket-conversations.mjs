import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-list-ticket-conversations",
  name: "List Conversations of a Ticket",
  description: "List all conversations for a ticket. [See the documentation](https://developers.freshdesk.com/api/#list_all_ticket_notes)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    freshdesk,
    ticketId: {
      propDefinition: [
        freshdesk,
        "ticketId",
      ],
    },
    maxResults: {
      propDefinition: [
        freshdesk,
        "maxResults",
      ],
    },
  },
  methods: {
    async listTicketConversations({
      ticketId, ...args
    }) {
      return this.freshdesk._makeRequest({
        url: `/tickets/${ticketId}/conversations`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const results = await this.freshdesk.getPaginatedResources({
      fn: this.listTicketConversations,
      args: {
        $,
        ticketId: this.ticketId,
      },
      max: this.maxResults,
    });

    $.export("$summary", `Successfully listed ${results.length} conversation${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
