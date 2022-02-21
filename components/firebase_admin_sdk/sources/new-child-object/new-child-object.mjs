import common from "../common.mjs";

export default {
  ...common,
  key: "firebase_admin_sdk-new-child-object",
  name: "New Child Object in a Realtime Database",
  description: "Emit new event when a new child object is discovered within a specific path",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    path: {
      propDefinition: [
        common.props.firebase,
        "path",
      ],
    },
  },
  methods: {
    ...common.methods,
    async processEvent(event) {
      const { timestamp } = event;
      const ref = this.firebase.getApp().database()
        .ref(this.path);
      const snapshot = await ref.get();
      const children = snapshot.val() || {};
      for (const [
        key,
        value,
      ] of Object.entries(children)) {
        const meta = this.generateMeta(key, timestamp);
        const child = {
          [key]: value,
        };
        this.$emit(child, meta);
      }
    },
    generateMeta(key, timestamp) {
      return {
        id: key,
        summary: `New child object: ${key}`,
        ts: timestamp,
      };
    },
  },
};
