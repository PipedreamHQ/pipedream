import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "attio-list-entry-deleted-instant",
  name: "New List Entry Deleted (Instant)",
  description: "Emit new event when a list entry is deleted (i.e. when a record is removed from a list).",
  version: "0.0.5",
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
          event_type: "list-entry.deleted",
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
        summary: `Deleted Entry with ID: ${entry.id.entry_id}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
