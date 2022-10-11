import { defineSource } from "@pipedream/types";
import common from "../common";

export default defineSource({
  ...common,
  key: "google_workspace-new-admin-activity",
  name: "New Admin Activity",
  description: "Emit new admin activities",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getMetadata(resource) {
      return {
        id: resource.timestamp,
        ts: resource.timestamp,
        summary: "New Admin Activity",
      };
    },
  },
});

