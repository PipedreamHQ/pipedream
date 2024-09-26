export default {
  key: "stripe-new-payment",
  name: "New Payment",
  description: "Emit new event for each new payment",
  version: "0.0.1",
  type: "source",
  props: {
    stripe: {
      type: "app",
      app: "stripe",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      let enabledEvents = this.getEvents();

      if (enabledEvents.includes("*")) enabledEvents = [
        "*",
      ];

      const endpoint = await this.stripe.sdk().webhookEndpoints.create({
        url: this.http.endpoint,
        enabled_events: enabledEvents,
      });
      this.db.set("endpoint", JSON.stringify(endpoint));

      for (const eventType of enabledEvents) {
        const events = await this.stripe.getEvents({
          eventType,
        });

        for (const event of events) {
          this.emitEvent(event);
        }
      }
    },
    async deactivate() {
      const endpoint = this.getEndpoint();
      this.db.set("endpoint", null);
      if (!endpoint) return;
      const confirmation = await this.stripe.sdk().webhookEndpoints.del(endpoint.id);
      if ("deleted" in confirmation && !confirmation.deleted) {
        throw new Error("Webhook endpoint not deleted");
      }
    },
  },
  methods: {
    getEvents() {
      return [
        "payment_intent.created",
      ];
    },
  },
  run(event) {
    const endpoint = this.db.get("endpoint");
    if (!endpoint) {
      this.http.respond({
        status: 500,
      });
      throw new Error("Webhook endpoint config missing from db");
    }
    const sig = event.headers["stripe-signature"];
    try {
      event = this.stripe.sdk().webhooks.constructEvent(event.bodyRaw, sig, endpoint.secret);
    } catch (err) {
      this.http.respond({
        status: 400,
        body: err.message,
      });
      console.log(err.message);
      return;
    }
    this.http.respond({
      status: 200,
    });

    this.$emit(event, {
      id: event.id,
      summary: `New event ${event.type} with ID ${event.data.id}`,
      ts: Date.parse(event.created),
    });
  },
};
