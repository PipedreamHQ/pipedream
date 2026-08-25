import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "attio-record-updated-instant",
  name: "New Record Updated (Instant)",
  description: "Emit new event when values on a record, such as person, company or deal, are updated",
  version: "0.0.6",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    objectId: {
      propDefinition: [
        common.props.attio,
        "objectId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getSubscriptions() {
      return [
        {
          event_type: "record.updated",
          filter: {
            "$and": [
              {
                field: "id.object_id",
                operator: "equals",
                value: this.objectId,
              },
            ],
          },
        },
      ];
    },
    generateMeta(record) {
      const ts = Date.now();
      return {
        id: `${record.id.record_id}-${ts}`,
        summary: `New Record with ID: ${record.id.record_id}`,
        ts,
      };
    },
  },
  sampleEmit,
};
