import common from "../common.mjs";

export default {
  ...common,
  key: "hubspot-new-event",
  name: "New Events",
  description: "Emits an event for each new Hubspot event.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
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
  },
  async run() {
    const occurredAfter = this._getAfter();

    for (const objectId of this.objectIds) {
      const params = {
        limit: 100,
        objectType: this.objectType,
        objectId,
        occurredAfter,
      };

      await this.paginate(
        params,
        this.hubspot.getEvents.bind(this),
        "results",
        occurredAfter,
      );
    }

    this._setAfter(Date.now());
  },
};
