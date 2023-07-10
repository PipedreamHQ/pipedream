import stripe from "../../stripe.app.mjs";

export default {
  props: {
    stripe,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  methods: {
    getEvents() {
      throw new Error("getEvent method is not implemented");
    },
    emitEvent(event) {
      this.$emit(event, {
        id: event.id,
        summary: `New event ${event.type} with ID ${event.data.id}`,
        ts: Date.parse(event.created),
      });
    },
    getEndpoint() {
      let endpoint;
      const endpointJson = this.db.get("endpoint");
      try {
        endpoint = JSON.parse(endpointJson);
      } catch (err) {
        console.error(err);
      }
      return endpoint;
    },
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
  run(event) {
    const endpoint = this.getEndpoint();
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

    this.emitEvent(event);
  },
};
