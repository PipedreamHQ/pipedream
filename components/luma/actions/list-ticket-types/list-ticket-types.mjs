import luma from "../../luma.app.mjs";
import { extractEntries } from "../../common/utils.mjs";

export default {
  key: "luma-list-ticket-types",
  name: "List Ticket Types",
  description: "List ticket types for a Luma event. Use this before assigning custom tickets through Luma's guest-management APIs. [See the documentation](https://docs.luma.com/reference/get_v1-event-ticket-types-list)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    luma,
    eventId: {
      propDefinition: [
        luma,
        "eventId",
      ],
    },
    includeHidden: {
      type: "boolean",
      label: "Include Hidden",
      description: "Whether to include hidden ticket types.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const response = await this.luma.listTicketTypes({
      $,
      params: {
        event_id: this.eventId,
        include_hidden: this.includeHidden
          ? "true"
          : undefined,
      },
    });
    const ticketTypes = response?.ticket_types ?? extractEntries(response, "ticket_type");

    $.export("$summary", `Retrieved ${ticketTypes.length ?? 0} ticket types`);
    return response;
  },
};
