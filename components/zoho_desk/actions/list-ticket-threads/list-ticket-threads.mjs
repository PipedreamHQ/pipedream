import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-list-ticket-threads",
  name: "List Ticket Threads",
  description: "Get a list of threads for a specified ticket. [See the documentation](https://desk.zoho.com/DeskAPIDocument#Threads#Threads_Listallthreads)",
  type: "action",
  version: "0.0.5",
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
    includeFullContent: {
      type: "boolean",
      label: "Include Full Content",
      description: "Whether to include the full content of the threads",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      orgId,
      ticketId,
      from,
      limit,
      includeFullContent,
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

    let threads;
    if (includeFullContent) {
      threads = await Promise.all(response.data.map(async (thread) => {
        return await this.zohoDesk.getThreadDetails({
          $,
          ticketId,
          threadId: thread.id,
        });
      }));
    } else {
      threads = response.data || [];
    }

    $.export("$summary", `Successfully retrieved ${threads.length} thread(s)`);

    return threads;
  },
};
