const hubspot = require("../../hubspot.app.js");

module.exports = {
  key: "hubspot-new-event",
  name: "New Events",
  description: "Emits an event for each new Hubspot event.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    hubspot,
    objectType: {
      type: "string",
      label: "Object Type",
      optional: false,
      async options(opts) {
        return [
          {
            label: "Companies",
            value: "company",
          },
          {
            label: "Contacts",
            value: "contact",
          },
          {
            label: "Deals",
            value: "deal",
          },
          {
            label: "Tickets",
            value: "ticket",
          },
        ];
      },
    },
    objectIds: {
      type: "string[]",
      label: "Object",
      optional: false,
      async options() {
        let objectType = null;
        if (this.objectType == "company") objectType = "companies";
          else objectType = `${this.objectType}s`;
        const results = await this.hubspot.getObjects(objectType);
        const options = results.map((result) => {
          if (objectType == "companies") label = result.properties.name;
          else if (objectType == "contacts")
            label = `${result.properties.firstname} ${result.properties.lastname}`;
          else if (objectType == "deals") label = result.properties.dealname;
          else if (objectType == "tickets") label = result.properties.subject;
          return { label, value: JSON.stringify({ label, value: result.id }) };
        });
        return options;
      },
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  async run(event) {
    const lastRun = this.db.get("occurredAfter") || this.hubspot.monthAgo();
    const occurredAfter = new Date(lastRun);

    const results = await this.hubspot.getEvents(this.objectIds, this.objectType, occurredAfter.getTime());
    for (const result of results) {
      this.$emit(result, {
        id: result.id,
        summary: `${result.label} ${result.eventType}`,
        ts: Date.now(),
      });
    }

    this.db.set("occurredAfter", Date.now());
  },
};