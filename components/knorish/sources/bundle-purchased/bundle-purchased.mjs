import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "knorish-bundle-purchased",
  name: "New Bundle Purchased",
  description: "Emit new event when a bundle is purchased by user. [See the documentation](https://knowledge.knorish.com/api-endpoints-and-postman-dump-publisher-api)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    bundleId: {
      propDefinition: [
        common.props.knorish,
        "bundleId",
      ],
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getFunction() {
      return this.knorish.listBundleUsers;
    },
    getSummary(item) {
      return `Bundle with ID: ${this.bundleId}  whas purchased by user ${item.name} with ID: ${item.id}`;
    },
    getParams() {
      return {
        id: this.bundleId,
      };
    },
  },
  sampleEmit,
};
