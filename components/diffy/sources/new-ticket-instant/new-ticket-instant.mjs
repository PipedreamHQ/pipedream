import diffy from "../../diffy.app.mjs";

export default {
  key: "diffy-new-ticket-instant",
  name: "New Ticket Instant",
  description: "Emit new event when a bug-tracking ticket is created in Diffy.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    diffy: {
      type: "app",
      app: "diffy",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    ticketDetails: {
      propDefinition: [
        diffy,
        "ticketDetails",
      ],
    },
  },
  hooks: {
    async activate() {
      const { data } = await this.diffy.createTicket(this.ticketDetails);
      this.db.set("ticketId", data.id);
    },
    async deactivate() {
      const ticketId = this.db.get("ticketId");
      await this.diffy.deleteTicket(ticketId);
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // validate the incoming webhook
    if (headers["X-Diffy-Signature"] !== this.diffy.$auth.oauth_access_token) {
      this.http.respond({
        status: 401,
      });
      return;
    }

    // emit the event
    this.$emit(body, {
      id: body.id,
      summary: `New Ticket: ${body.title}`,
      ts: Date.parse(body.created_at),
    });
  },
};
