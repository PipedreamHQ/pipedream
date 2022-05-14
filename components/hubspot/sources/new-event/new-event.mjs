import common from "../common.mjs";

export default {
  ...common,
  key: "hubspot-new-event",
  name: "New Events",
  description: "Emit new event for each new Hubspot event.",
  version: "0.0.4",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    objectType: {
      propDefinition: [
        common.props.hubspot,
        "objectType",
      ],
    },
    objectIds: {
      propDefinition: [
        common.props.hubspot,
        "objectIds",
        (c) => ({
          objectType: c.objectType,
        }),
      ],
    },
  },
  hooks: {},
  methods: {
    ...common.methods,
    generateMeta(result) {
      const {
        id,
        eventType,
      } = result;
      return {
        id,
        summary: eventType,
        ts: Date.now(),
      };
    },
    getParams() {
      return null;
    },
    getEventParams(objectId, occurredAfter) {
      return {
        limit: 100,
        objectType: this.objectType,
        objectId,
        occurredAfter,
      };
    },
    async processResults(after) {
      for (const objectId of this.objectIds) {
        const params = this.getEventParams(objectId, after);
        await this.paginate(
          params,
          this.hubspot.getEvents.bind(this),
          "results",
          after,
        );
      }
    },
  },
};
