import common from "../common/base.mjs";

export default {
  ...common,
  key: "firebase_admin_sdk-create-realtime-db-record",
  name: "Create Firebase Realtime Database Record",
  description: "Creates or replaces a child object within your Firebase Realtime Database. [See the docs here](https://firebase.google.com/docs/reference/js/database#update)",
  version: "0.0.9",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    path: {
      propDefinition: [
        common.props.firebase,
        "path",
      ],
    },
    data: {
      propDefinition: [
        common.props.firebase,
        "data",
      ],
      description: "Multiple property-value pairs that will be written to the Database together",
    },
  },
  methods: {
    async getResponse() {
      return this.firebase.createRealtimeDBRecord(this.path, this.data);
    },
    emitSummary($) {
      $.export("$summary", "Successfully created record");
    },
    async deleteApp() {
      this.firebase.deleteApp();
      await new Promise((resolve) => setTimeout(resolve, 5000));
    },
  },
  async run({ $ }) {
    try {
      await this.firebase.initializeApp(this.databaseRegion);
      const response = await this.getResponse();
      this.emitSummary($);
      return response;
    } finally {
      await this.deleteApp();
    }
  },
};
