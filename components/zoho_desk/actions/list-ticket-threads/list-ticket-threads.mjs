import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-list-ticket-threads",
  name: "List Ticket Threads",
  description: "Get a list of threads for a specified ticket. [See the documentation](https://desk.zoho.com/DeskAPIDocument#Threads#Threads_Listallthreads)",
  type: "action",
  version: "0.0.2",
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
    from: {
      propDefinition: [
        zohoDesk,
        "from",
      ],
    },
    limit: {
      propDefinition: [
        zohoDesk,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const {
      orgId,
      ticketId,
      from,
      limit,
    } = this;

    const params = {};
    if (from) params.from = from;
    if (limit) params.limit = limit;

    const response = await this.zohoDesk.getTicketThreads({
      $,
      ticketId,
      headers: {
        orgId,
      },
      params,
    });

    const threads = response.data || [];
    $.export("$summary", `Successfully retrieved ${threads.length} thread(s)`);

    return threads;
  },
};
