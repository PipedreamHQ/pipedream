import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-get-ticket",
  name: "Get Ticket Details",
  description: "Get details of a Ticket. [See the documentation](https://developers.freshdesk.com/api/#view_a_ticket)",
  version: "0.1.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    freshdesk,
    ticketId: {
      propDefinition: [
        freshdesk,
        "ticketId",
      ],
    },
    include: {
      type: "string[]",
      label: "Include",
      description: "Include additional data in the response",
      optional: true,
      options: [
        "conversations",
        "requester",
        "company",
        "stats",
      ],
    },
  },
  async run({ $ }) {
    const {
      freshdesk, ticketId, include,
    } = this;
    const response = await freshdesk.getTicket({
      $,
      ticketId,
      params: include
        ? {
          include: include.join(","),
        }
        : undefined,
    });
    response && $.export("$summary", "Successfully retrieved ticket");
    return response;
  },
};
