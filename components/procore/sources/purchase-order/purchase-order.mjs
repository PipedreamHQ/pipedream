import constants from "../../common/constants.mjs";
import common from "../common/webhook.mjs";

export default {
  ...common,
  name: "New Purchase Order Event (Instant)",
  key: "procore-purchase-order",
  description: "Emit new event each time a Purchase Order is created, updated, or deleted in a project.",
  version: "0.1.0",
  type: "source",
  methods: {
    ...common.methods,
    getPurchaseOrder({
      poId, ...args
    } = {}) {
      return this.app.makeRequest({
        path: `/purchase_order_contracts/${poId}`,
        ...args,
      });
    },
    getResourceName() {
      return constants.RESOURCE_NAMES.PURCHASE_ORDER_CONTRACTS;
    },
    async getDataToEmit(body) {
      const {
        companyId,
        projectId,
      } = this;
      const { resource_id: resourceId } = body;
      const resource = await this.getPurchaseOrder({
        poId: resourceId,
        headers: this.app.companyHeader(companyId),
        params: {
          project_id: projectId,
        },
      });
      return {
        ...body,
        resource,
      };
    },
    getMeta({
      id, event_type, timestamp, resource,
    }) {
      const {
        title, id: purchaseOrderId,
      } = resource;
      const eventType = event_type;
      const summary = title
        ? `${eventType} ${title}`
        : `${eventType} Purchase Order ID:${purchaseOrderId}`;
      const ts = new Date(timestamp).getTime();
      return {
        id,
        summary,
        ts,
      };
    },
  },
};
