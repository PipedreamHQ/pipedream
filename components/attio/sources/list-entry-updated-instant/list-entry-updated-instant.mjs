import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "attio-list-entry-updated-instant",
  name: "New List Entry Updated (Instant)",
  description: "Emit new event when an existing list entry is updated (i.e. when a list attribute is changed for a specific list entry, e.g. when setting \"Owner\")",
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
          event_type: "list-entry.updated",
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
      const ts = Date.now();
      return {
        id: `${entry.id.entry_id}-${ts}`,
        summary: `Updated Entry with ID: ${entry.id.entry_id}`,
        ts,
      };
    },
  },
  sampleEmit,
};
