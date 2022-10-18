import { defineSource } from "@pipedream/types";
import common from "../common";

export default defineSource({
  ...common,
  key: "google_workspace-new-admin-activity-by-app-name",
  name: "New Admin Activity By Application Name",
  description: "Emit new admin activities by selected user",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    applicationName: {
      propDefinition: [
        common.props.googleWorkspace,
        "applicationName",
      ],
    },
  },
  methods: {
    ...common.methods,
    getApplicationName() {
      return this.applicationName;
    },
    getMetadata(data) {
      return {
        id: data.id.uniqueQualifier,
        ts: Date.parse(data.id.time),
        summary: "New Admin Activity By App Name",
      };
    },
  },
});

