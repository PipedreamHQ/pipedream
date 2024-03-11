import tawkTo from "../../tawk_to.app.mjs";

export default {
  key: "tawk_to-new-ticket-instant",
  name: "New Ticket Instant",
  description: "Emit new event when a new ticket is created. [See the documentation](https://docs.tawk.to/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    tawkTo: {
      type: "app",
      app: "tawk_to",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    ticketSubject: {
      propDefinition: [
        tawkTo,
        "ticketSubject",
      ],
    },
    initialComment: {
      propDefinition: [
        tawkTo,
        "initialComment",
      ],
    },
    submitter: {
      propDefinition: [
        tawkTo,
        "submitter",
      ],
    },
  },
  hooks: {
    async activate() {
      // Create a new ticket when the source is activated
      await this.tawkTo.createTicket(this.ticketSubject, this.initialComment, this.submitter);
    },
  },
  async run(event) {
    const { body } = event;

    if (body.subject !== this.ticketSubject || body.comment !== this.initialComment || body.submitter !== this.submitter) {
      return;
    }

    this.$emit(body, {
      id: body.id,
      summary: `New ticket created: ${body.subject}`,
      ts: Date.now(),
    });
  },
};
