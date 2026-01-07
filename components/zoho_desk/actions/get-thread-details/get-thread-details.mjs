import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-get-thread-details",
  name: "Get Thread Details",
  description: "Retrieve details for a specific thread belonging to a ticket. [See the documentation](https://desk.zoho.com/DeskAPIDocument#Threads_Getathread)",
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
    threadId: {
      propDefinition: [
        zohoDesk,
        "threadId",
        ({
          orgId, ticketId,
        }) => ({
          orgId,
          ticketId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      orgId,
      ticketId,
      threadId,
    } = this;

    const response = await this.zohoDesk.getThreadDetails({
      $,
      ticketId,
      threadId,
      headers: {
        orgId,
      },
    });

    $.export("$summary", `Successfully retrieved thread details for thread ID ${threadId}`);

    return response.data || response;
  },
};
