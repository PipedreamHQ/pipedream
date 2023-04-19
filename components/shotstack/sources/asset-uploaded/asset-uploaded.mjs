import common from "../common/polling.mjs";

export default {
  ...common,
  key: "shotstack-asset-uploaded",
  name: "Asset Uploaded",
  description: "Trigger when a new media asset has been uploaded to the Shotstack API. [See the documentation here](https://shotstack.io/docs/api/?shell#list-sources).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "resource";
    },
    getResourceFn() {
      return this.app.listResources;
    },
    getResourceFnArgs() {
      return {};
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Resource: ${resource.name}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
