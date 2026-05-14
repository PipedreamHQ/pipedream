import luma from "../../luma.app.mjs";
import { parseRequiredJsonArray } from "../../common/utils.mjs";

export default {
  key: "luma-send-invites",
  name: "Send Invites",
  description: "Send email invitations for a Luma event. Guests are invited but not automatically marked as going. Use **Add Guests** when guests should be added with status `Going`. [See the documentation](https://docs.luma.com/reference/post_v1-event-send-invites)",
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
    message: {
      type: "string",
      label: "Message",
      description: "Optional invite message. Luma limits this to 200 characters.",
      optional: true,
    },
  },
  async run({ $ }) {
    const guests = parseRequiredJsonArray(this.guestsJson, "Guests");
    const response = await this.luma.sendInvites({
      $,
      data: {
        event_id: this.eventId,
        guests,
        message: this.message,
      },
    });

    $.export("$summary", `Sent ${guests.length} invites for event ${this.eventId}`);
    return response;
  },
};
