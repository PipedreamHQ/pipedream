import luma from "../../luma.app.mjs";
import { parseRequiredJsonArray } from "../../common/utils.mjs";

export default {
  key: "luma-add-guests",
  name: "Add Guests",
  description: "Add guests to a Luma event with status `Going`. Guests receive the default ticket type unless custom ticket assignments are configured in Luma separately. Use **List Events** first if you need to find the event ID. [See the documentation](https://docs.luma.com/reference/post_v1-event-add-guests)",
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
  },
  async run({ $ }) {
    const guests = parseRequiredJsonArray(this.guestsJson, "Guests");
    const response = await this.luma.addGuests({
      $,
      data: {
        event_id: this.eventId,
        guests,
      },
    });

    $.export("$summary", `Added ${guests.length} guests to event ${this.eventId}`);
    return response;
  },
};
