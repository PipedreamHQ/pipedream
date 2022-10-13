import { defineSource } from "@pipedream/types";
import common from "../common";

export default defineSource({
  ...common,
  key: "google_workspace-new-admin-activity-by-user-and-app-name",
  name: "New Admin Activity By User And Application Name",
  description: "Emit new admin activities by selected user and application name",
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
    applicationName: {
      propDefinition: [
        common.props.googleWorkspace,
        "applicationName",
      ],
    },
  },
  methods: {
    ...common.methods,
    getUserKey() {
      return this.userKey;
    },
    getApplicationName() {
      return this.applicationName;
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

