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
            label: "Conatcts",
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
      async options({ page, prevContext }) {
        let objectType, label;
        if (this.objectType == "company") objectType = "companies";
        else objectType = `${this.objectType}s`;
        const params = {
          limit: 100,
        };
        if (Object.keys(prevContext).length !== 0) params.next = prevContext;

        const results = await this.hubspot.getObjects(objectType, params);
        const options = results.results.map((result) => {
          if (objectType == "companies") label = result.properties.name;
          else if (objectType == "contacts")
            label = `${result.properties.firstname} ${result.properties.lastname}`;
          else if (objectType == "deals") label = result.properties.dealname;
          else if (objectType == "tickets") label = result.properties.subject;
          return { label, value: JSON.stringify({ label, value: result.id }) };
        });
        const after = results.paging ? results.paging.next.after : null;
        return {
          options,
          context: { after },
        };
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

    for (let objectId of this.objectIds) {
      objectId = JSON.parse(objectId);
      const params = {
        limit: 100,
        objectType: this.objectType,
        objectId: objectId.value,
        occurredAfter,
      };

      let results = null;

      while (!results || params.after) {
        results = await this.hubspot.getEvents(params);
        if (results.paging) params.after = results.paging.next.after;
        else delete params.after;
        for (const result of results.results) {
          this.$emit(result, {
            id: result.id,
            summary: `${objectId.label} ${result.eventType}`,
            ts: Date.now(),
          });
        }
      }
    }

    this.db.set("occurredAfter", Date.now());
  },
};