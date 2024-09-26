export default {
  key: "shipcloud-new-shipment-status",
  name: "New Shipment Status",
  description: "Emit new event for shipment status changes [See docs here](https://developers.shipcloud.io/reference/#webhooks)",
  version: "0.0.1",
  type: "source",
  props: {
    shipcloud: {
      type: "app",
      app: "shipcloud",
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    eventTypes: {
      label: "Event types",
      description: "The shipment update(s) that should trigger an event",
      type: "string[]",
      options: [
        "shipment.*",
        "shipment.status.*",
        "shipment.status.deleted",
        "shipment.tracking.*",
        "shipment.tracking.awaits_pickup_by_receiver",
        "shipment.tracking.canceled",
        "shipment.tracking.delayed",
        "shipment.tracking.delivered",
        "shipment.tracking.destroyed",
        "shipment.tracking.exception",
        "shipment.tracking.label_created",
        "shipment.tracking.not_delivered",
        "shipment.tracking.notification",
        "shipment.tracking.out_for_delivery",
        "shipment.tracking.picked_up",
        "shipment.tracking.transit",
        "shipment.tracking.unknown",
      ],
    },
  },
  hooks: {
    async activate() {
      const data = {
        event_types: this.eventTypes,
        url: this.http.endpoint,
      };

      const { id } = await this.shipcloud.createHook(data);

      this.db.set("hookId", id);
    },
    async deactivate() {
      const id = this.db.get("hookId");

      await this.shipcloud.deleteHook({
        id,
      });
    },
  },
  async run(data) {
    this.http.respond({
      status: 200,
    });

    const { body } = data;

    let { id } = body;
    if (typeof id !== "string") {
      id = Date.now();
    }

    let summary = body.type;
    if (typeof summary !== "string") {
      summary = "Unknown event type";
    }

    const date = body.occured_at;
    const ts = typeof date === "string"
      ? new Date(date).valueOf()
      : Date.now();

    this.$emit(body, {
      id,
      summary,
      ts,
    });
  },
};
