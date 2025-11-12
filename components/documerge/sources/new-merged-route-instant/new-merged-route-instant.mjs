import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "documerge-new-merged-route-instant",
  name: "New Merged Route (Instant)",
  description: "Emit new event when a merged route is created in documerge.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    routeIds: {
      propDefinition: [
        common.props.documerge,
        "routeId",
      ],
      type: "string[]",
      label: "Route IDs",
      description: "An array of route identifiers of the routes to watch",
    },
  },
  hooks: {
    async activate() {
      const deliveryMethodIds = {};
      for (const routeId of this.routeIds) {
        const { data: { id } } = await this.documerge.createRouteDeliveryMethod({
          routeId,
          data: this.getWebhookSettings(),
        });
        deliveryMethodIds[routeId] = id;
      }
      this._setDeliveryMethodIds(deliveryMethodIds);
    },
    async deactivate() {
      const deliveryMethodIds = this.getDeliveryMethodIds();
      for (const routeId of this.routeIds) {
        await this.documerge.deleteRoutetDeliveryMethod({
          routeId,
          deliveryMethodId: deliveryMethodIds[routeId],
        });
      }
      this._setDeliveryMethodIds({});
    },
  },
  methods: {
    ...common.methods,
    getSummary(body) {
      return `Merged Route: ${body.file_name}`;
    },
  },
  sampleEmit,
};
