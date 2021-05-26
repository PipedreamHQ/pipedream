const common = require("../common.js");

module.exports = {
  ...common,
  key: "firebase_admin_sdk-new-child-object",
  name: "New Child Object in a Realtime Database",
  description:
    "Emits an event when a new child object is discovered within a specific path",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    path: { propDefinition: [common.props.firebase, "path"] },
  },
  methods: {
    ...common.methods,
    generateMeta(key, timestamp) {
      return {
        id: key,
        summary: key,
        ts: timestamp,
      };
    },
  },
  async run(event) {
    const { timestamp } = event;
    const app = this.firebase.getApp();

    const ref = app.database().ref(this.path);

    // Comment left in for review.
    // ref.get() returns a promise, but awaiting it results in the error:
    // "Pipedream detected that component was still running code..."
    // Suggestions for  how to resove it?
    let children;
    await new Promise((resolve) => {
      ref.get().then(function (snapshot) {
        children = snapshot.val();
        resolve();
      });
    });  

    for (const [key, value] of Object.entries(children)) {
      const meta = this.generateMeta(key, timestamp);
      const child = { key: value };
      this.$emit(child, meta);
    }
  },
};