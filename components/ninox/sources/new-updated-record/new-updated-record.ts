import common from "../common/common";
import { defineSource } from "@pipedream/types";

export default defineSource({
  ...common,
  name: "New Updated Record",
  version: "0.0.1",
  key: "ninox-new-updated-record",
  description: "Emit new event on each record is updated.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent(data) {
      if (data.createdAt === data.modifiedAt) {
        return;
      }

      this._setLastRecordId(data.id);

      this.$emit(data, {
        id: `${data.id}-${data.modifiedAt}`,
        summary: `New record updated with id ${data.id}`,
        ts: Date.parse(data.modifiedAt),
      });
    },
  },
});
