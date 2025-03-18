import common from "../common/webhook.mjs";
import resourceNames from "../../common/resource-names.mjs";

export default {
  ...common,
  name: "New Purchase Order Event (Instant)",
  key: "procore-new-purchase-order-event-instant",
  description: "Emit new event when a new purchase order event is created. [See the documentation](https://developers.procore.com/reference/rest/hooks?version=latest).",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getResourceName() {
      return resourceNames.PURCHASE_ORDER_CONTRACTS;
    },
    async getDataToEmit(body) {
      const {
        app,
        companyId,
      } = this;
      const {
        resource_id: purchaseOrderContractId,
        project_id: projectId,
      } = body;

      try {
        const resource = await app.getPurchaseOrderContract({
          companyId,
          purchaseOrderContractId,
          params: {
            project_id: projectId,
          },
        });
        return {
          ...body,
          resource,
        };
      } catch (error) {
        console.log(error.message || error);
        return body;
      }
    },
    generateMeta(body) {
      return {
        id: body.id,
        summary: `New Purchase Order Event: ${body.resource_id}`,
        ts: new Date(body.timestamp).getTime(),
      };
    },
  },
};
