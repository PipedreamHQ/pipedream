const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-custom-webhook-events",
  name: "Custom Webhook Events",
  type: "source",
  version: "0.0.3",
  description: "Subscribe to one or more event types and emit an event on each webhook request",
  props: {
    stripe,
    enabledEvents: {
      type: "string[]",
      label: "Events",
      description: "Events to listen for (select '*' for all)",
      options() {
        return this.stripe.enabledEvents();
      },
      default: [
        "*",
      ],
    },
    /* eslint-disable pipedream/props-label */
    /* eslint-disable pipedream/props-description */
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    /* eslint-enable pipedream/props-description */
    /* eslint-enable pipedream/props-label */
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      let enabledEvents = this.enabledEvents;
      if (enabledEvents.includes("*")) enabledEvents = [
        "*",
      ];
      const endpoint = await this.stripe.sdk().webhookEndpoints.create({
        url: this.http.endpoint,
        enabled_events: enabledEvents,
      });
      this.db.set("endpoint", JSON.stringify(endpoint));
    },
    async deactivate() {
      const endpoint = this.getEndpoint();
      this.db.set("endpoint", null);
      if (!endpoint) return;
      const confirmation = await this.stripe.sdk().webhookEndpoints.del(endpoint.id);
      if ("deleted" in confirmation && !confirmation.deleted) {
        throw new Error("endpoint not deleted");
      }
    },
  },
  run(event) {
    const endpoint = this.getEndpoint();
    if (!endpoint) {
      this.http.respond({
        status: 500,
      });
      throw new Error("endpoint config missing from db");
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
    this.$emit(event);
  },
  methods: {
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
};
