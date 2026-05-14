import luma from "../../luma.app.mjs";

export default {
  key: "luma-get-guest",
  name: "Get Guest",
  description: "Get detailed information for a Luma event guest by guest ID, ticket key, guest key, or email. Use **Get Guests** first if you need to find a guest identifier. [See the documentation](https://docs.luma.com/reference/get_v1-event-get-guest)",
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
    guestId: {
      type: "string",
      label: "Guest Identifier",
      description: "Guest ID (`gst-...`), ticket key, guest key (`g-...`), or the guest's email address.",
    },
  },
  async run({ $ }) {
    const response = await this.luma.getGuest({
      $,
      eventId: this.eventId,
      guestId: this.guestId,
    });
    const guest = response?.guest ?? response;
    const name = guest?.name || guest?.email
      ? `: ${guest.name ?? guest.email}`
      : "";

    $.export("$summary", `Retrieved guest ${this.guestId}${name}`);
    return response;
  },
};
