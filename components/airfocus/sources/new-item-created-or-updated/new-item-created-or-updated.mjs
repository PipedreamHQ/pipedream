import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "airfocus-new-item-created-or-updated",
  name: "New Item Created or Updated",
  description: "Emit new event when a new item is created or an existing one is updated.",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFilterField() {
      return "lastUpdatedAt";
    },
    getSummary(item) {
      return `New Item ${(item.createdAt === item.lastUpdatedAt)
        ?  "Created"
        : "Updated"}: ${item.name}`;
    },
    getInnerFilter({ lastDate }) {
      return [
        {
          inner: [
            {
              type: "createdAt",
              mode: "afterOrOn",
              value: {
                date: lastDate,
                zoneId: Intl.DateTimeFormat().resolvedOptions().timeZone,
              },
            },
            {
              type: "lastUpdatedAt",
              mode: "afterOrOn",
              value: {
                date: lastDate,
                zoneId: Intl.DateTimeFormat().resolvedOptions().timeZone,
              },
            },
          ],
          type: "or",
        },
      ];
    },
  },
  sampleEmit,
};
