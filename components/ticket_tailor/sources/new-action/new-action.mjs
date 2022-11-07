import app from "../../ticket_tailor.app.mjs";

export default {
  type: "source",
  dedupe: "unique",
  key: "ticket_tailor-new-event",
  name: "New Action (Instant)",
  description: "Emit new event when a new action occurs. You can use this source to handle one of the available options in Ticket Tailor. See how to configure the webhok [here](https://developers.tickettailor.com/#configuration)",
  version: "0.0.1",
  props: {
    app,
    http: "$.interface.http",
    sharedSecret: {
      type: "string",
      label: "Shared Secret",
      description: "The shared secret you configured in the webhook. We highly recommend you to use a secret key to prevent unauthorized access to your webhook.",
      optional: true,
    },
  },
  methods: {
    emit(event) {
      this.$emit(event, {
        id: event.id,
        summary: `${event.event} - ${event.payload?.name || event.id}`,
        ts: event.created_at || Date.now(),
      });
    },
    checkHmac() {
      if (!this.sharedSecret) {
        console.log("No shared secret configured. Skipping HMAC check.");
        return;
      }
    },
  },
  async run(event) {
    console.log(event);
    this.checkHmac(event);
    this.emit(event.body);
  },
};
