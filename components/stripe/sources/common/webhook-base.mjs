import app from "../../stripe.app.mjs";

export default {
  props: {
    app,
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
      const idText = event.data.object?.id ?
        `object ID ${event.data.object.id}` :
        `event ID ${event.id}`;
      this.$emit(event, {
        id: event.id,
        summary: `New event ${event.type} (${idText})`,
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

      const endpoint = await this.app.sdk().webhookEndpoints.create({
        url: this.http.endpoint,
        enabled_events: enabledEvents,
      });
      this.db.set("endpoint", JSON.stringify(endpoint));

      for (const eventType of enabledEvents) {
        const events = await this.app.getEvents({
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
      const confirmation = await this.app.sdk().webhookEndpoints.del(endpoint.id);
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
      event = this.app.sdk().webhooks.constructEvent(event.bodyRaw, sig, endpoint.secret);
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
