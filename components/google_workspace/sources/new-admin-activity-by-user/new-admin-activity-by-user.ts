import { defineSource } from "@pipedream/types";
import common from "../common";

export default defineSource({
  ...common,
  key: "google_workspace-new-admin-activity-by-user",
  name: "New Admin Activity By User",
  description: "Emit new admin activities by selected user",
  version: "0.0.2",
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
    getMetadata(data) {
      return {
        id: data.id.uniqueQualifier,
        ts: Date.parse(data.id.time),
        summary: "New Admin Activity By User",
      };
    },
  },
});

