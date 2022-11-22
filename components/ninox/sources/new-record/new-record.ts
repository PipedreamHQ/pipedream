import common from "../common/common";
import { defineSource } from "@pipedream/types";

export default defineSource({
  ...common,
  name: "New Record",
  version: "0.0.2",
  key: "ninox-new-record",
  description: "Emit new event on each created record.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTimestampField() {
      return "createdAt";
    },
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New record created with id ${data.id}`,
        ts: Date.parse(data.createdAt),
      });
    },
  },
});
