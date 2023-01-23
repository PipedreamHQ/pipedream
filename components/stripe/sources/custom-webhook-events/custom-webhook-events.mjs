import stripe from "../../stripe.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "stripe-custom-webhook-events",
  name: "New Custom Webhook Events",
  type: "source",
  version: "0.0.6",
  description: "Emit new event on each webhook event",
  props: {
    stripe,
    enabledEvents: {
      type: "string[]",
      label: "Events",
      description: "Events to listen for. Select `*` for all events",
      options: constants.WEBHOOK_EVENTS,
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

      for (const eventType of this.enabledEvents) {
        const events = await this.stripe.getEvents({
          eventType,
        });

        for (const event of events) {
          this.emit(event);
        }
      }
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

    this.emit(event);
  },
  methods: {
    emit(event) {
      this.$emit(event, {
        id: event.id,
        summary: `New event ${event.type} with id ${event.data.id}`,
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
};
