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
      return "data";
    },
    getResourceFn() {
      return this.app.listSources;
    },
    getResourceFnArgs() {
      return {};
    },
    resourceIsRelevant(resource) {
      const isRelevant = resource.attributes?.status === "ready";
      if (!isRelevant) {
        console.log(`Skipping asset ${resource.id} because it is not ready`);
        console.log(JSON.stringify(resource, null, 2));
      }
      return isRelevant;
    },
    generateMeta(resource) {
      const { source } = resource.attributes || {};
      const filename = source?.split("/").pop();
      return {
        id: resource.id,
        summary: `New Asset: ${filename}`,
        ts: Date.parse(resource.created),
      };
    },
  },
};
