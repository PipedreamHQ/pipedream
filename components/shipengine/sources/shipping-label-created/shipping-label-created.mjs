import common from "../common/polling.mjs";

export default {
  ...common,
  key: "shipengine-shipping-label-created",
  name: "New Shipping Label Created",
  description: "Emit new event when a new label is shipped. [See the docs](https://shipengine.github.io/shipengine-openapi/#operation/create_webhook).",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourcesFn() {
      return this.app.listLabels;
    },
    getResourcesFnArgs(url) {
      return {
        url,
        params: {
          created_at_start: this.getLastCreatedAtStart(),
        },
      };
    },
    getResourcesName() {
      return "labels";
    },
    generateMeta(resource) {
      return {
        id: resource.shipment_id,
        ts: Date.parse(resource.created_at),
        summary: `New Shipping Label ${resource.shipment_id}`,
      };
    },
  },
};
