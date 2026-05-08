import luma from "../../luma.app.mjs";
import {
  parseOptionalJsonArray,
  parseOptionalJsonObject,
  parseRequiredJsonArray,
} from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "luma-add-guests",
  name: "Add Guests",
  description: "Add guests to a Luma event with status `Going`. Guests receive the default ticket type unless Ticket JSON or Tickets JSON is provided. Use **List Events** first if you need to find the event ID, and **List Ticket Types** if assigning custom tickets. [See the documentation](https://docs.luma.com/reference/post_v1-event-add-guests)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    luma,
    eventId: {
      propDefinition: [
        luma,
        "eventId",
      ],
    },
    guestsJson: {
      propDefinition: [
        luma,
        "guestsJson",
      ],
    },
    ticketJson: {
      type: "string",
      label: "Ticket JSON",
      description: "Optional JSON object assigning one ticket type to each guest. Cannot be used with Tickets JSON. Example: `{\"ticket_type_id\":\"tt-123\"}`.",
      optional: true,
    },
    ticketsJson: {
      type: "string",
      label: "Tickets JSON",
      description: "Optional JSON array assigning multiple tickets to each guest. Cannot be used with Ticket JSON. Example: `[{\"ticket_type_id\":\"tt-123\"}]`.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.ticketJson && this.ticketsJson) {
      throw new ConfigurationError("Provide either Ticket JSON or Tickets JSON, not both.");
    }

    const guests = parseRequiredJsonArray(this.guestsJson, "Guests");
    const ticket = parseOptionalJsonObject(this.ticketJson, "Ticket JSON");
    const tickets = parseOptionalJsonArray(this.ticketsJson, "Tickets JSON");
    const response = await this.luma.addGuests({
      $,
      data: {
        event_id: this.eventId,
        guests,
        ticket,
        tickets,
      },
    });

    $.export("$summary", `Added ${guests.length} guests to event ${this.eventId}`);
    return response;
  },
};
