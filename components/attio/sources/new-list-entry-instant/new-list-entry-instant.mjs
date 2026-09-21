import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "attio-new-list-entry-instant",
  name: "New List Entry (Instant)",
  description: "Emit new event when a record, such as person, company, or deal, is added to a list",
  version: "0.0.6",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    listId: {
      propDefinition: [
        common.props.attio,
        "listId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getSubscriptions() {
      return [
        {
          event_type: "list-entry.created",
          filter: {
            "$and": [
              {
                field: "id.list_id",
                operator: "equals",
                value: this.listId,
              },
            ],
          },
        },
      ];
    },
    generateMeta(entry) {
      return {
        id: entry.id.entry_id,
        summary: `New Entry with ID: ${entry.id.entry_id}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
