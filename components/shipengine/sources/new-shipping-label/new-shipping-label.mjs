import common from "../common/webhook.mjs";
import utils from "../../common/utils.mjs";

export default {
  ...common,
  key: "shipengine-new-shipping-label",
  name: "New Shipping Label",
  description: "Emit new event when a new label is shipped. [See the docs](https://shipengine.github.io/shipengine-openapi/#operation/create_webhook).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourcesFn() {
      return this.app.listShipments;
    },
    getResourcesFnArgs(url) {
      return {
        url,
      };
    },
    getResourcesName() {
      return "shipments";
    },
    getEvent() {
      return "batch";
    },
    generateMeta(resource) {
      return {
        id: resource.shipment_id,
        ts: Date.parse(resource.created_at),
        summary: `New Shipping Label ${resource.shipment_id}`,
      };
    },
    async processEvents(response) {
      const { batch_shipments_url: batchShipments } = response;

      const stream = this.app.getResourcesStream({
        resourcesFn: this.getResourcesFn(),
        resourcesFnArgs: this.getResourcesFnArgs(batchShipments.href),
        resourcesName: this.getResourcesName(),
      });

      const resources = await utils.streamIterator(stream);

      resources
        .reverse()
        .forEach((resource) =>
          this.$emit(resource, this.generateMeta(resource)));
    },
  },
};
