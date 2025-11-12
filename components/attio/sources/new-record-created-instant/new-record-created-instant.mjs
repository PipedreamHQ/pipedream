import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "attio-new-record-created-instant",
  name: "New Record Created (Instant)",
  description: "Emit new event when new record, such as person, company or deal gets created",
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
          event_type: "record.created",
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
      return {
        id: record.id.record_id,
        summary: `New Record with ID: ${record.id.record_id}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
