import { defineSource } from "@pipedream/types";
import common from "../common";

export default defineSource({
  ...common,
  key: "google_workspace-new-admin-activity",
  name: "New Admin Activity",
  description: "Emit new admin activities",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getMetadata(data) {
      return {
        id: data.id.uniqueQualifier,
        ts: Date.parse(data.id.time),
        summary: "New Admin Activity",
      };
    },
  },
});

