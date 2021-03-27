const common = require("../common.js");

module.exports = {
  ...common,
  key: "hubspot-new-event",
  name: "New Events",
  description: "Emits an event for each new Hubspot event.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    objectType: { propDefinition: [common.props.hubspot, "objectType"] },
    objectIds: {
      propDefinition: [
        common.props.hubspot,
        "objectIds",
        (c) => ({ objectType: c.objectType }),
      ],
    },
  },
  methods: {
    ...common.methods,
    generateMeta(result) {
      const { id, eventType } = result;
      return {
        id,
        summary: eventType,
        ts: Date.now(),
      };
    },
    emitEvent(result) {
      const meta = this.generateMeta(result);
      this.$emit(result, meta);
    },
    isRelevant(result, occurredAfter) {
      return true;
    },
  },
  async run(event) {
    const occurredAfter =
      this.db.get("occurredAfter") || Date.parse(this.hubspot.monthAgo());

    for (let objectId of this.objectIds) {
      objectId = JSON.parse(objectId);
      const params = {
        limit: 100,
        objectType: this.objectType,
        objectId: objectId.value,
        occurredAfter,
      };

      await this.paginate(
        params,
        this.hubspot.getEvents.bind(this),
        "results",
        occurredAfter
      );
    }

    this.db.set("occurredAfter", Date.now());
  },
};