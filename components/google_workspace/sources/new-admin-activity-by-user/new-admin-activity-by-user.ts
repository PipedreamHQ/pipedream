import { defineSource } from "@pipedream/types";
import common from "../common";

export default defineSource({
  ...common,
  key: "google_workspace-new-admin-activity-by-user",
  name: "New Admin Activity By User",
  description: "Emit new admin activities by selected user",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    userKey: {
      propDefinition: [
        common.props.googleWorkspace,
        "userKey",
      ],
    },
  },
  methods: {
    ...common.methods,
    getUserKey() {
      return this.userKey;
    },
    getMetadata(resource) {
      return {
        id: resource.timestamp,
        ts: resource.timestamp,
        summary: "New Admin Activity",
      };
    },
  },
});

