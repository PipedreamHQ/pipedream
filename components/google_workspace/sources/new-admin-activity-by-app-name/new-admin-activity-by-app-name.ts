import common from "../common";

export default {
  ...common,
  key: "google_workspace-new-admin-activity-by-app-name",
  name: "New Admin Activity By Application Name",
  description: "Emit new admin activities by selected user",
  version: "0.0.1",
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
    getMetadata(resource) {
      return {
        id: resource.timestamp,
        ts: resource.timestamp,
        summary: "New Admin Activity",
      };
    },
  },
};

