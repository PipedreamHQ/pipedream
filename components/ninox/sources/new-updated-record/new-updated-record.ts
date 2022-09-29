import common from "../common/common";
import { defineSource } from "@pipedream/types";

export default defineSource({
  ...common,
  name: "New Updated Record",
  version: "0.0.1",
  key: "ninox-new-updated-record",
  description: "Emit new event on each updated record.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTimestampField() {
      return 'modifiedAt'
    },
    emitEvent(data) {
      if (data.createdAt === data.modifiedAt) {
        return;
      }

      this.$emit(data, {
        id: `${data.id}-${data.modifiedAt}`,
        summary: `New record updated with id ${data.id}`,
        ts: Date.parse(data.modifiedAt),
      });
    },
  },
});
