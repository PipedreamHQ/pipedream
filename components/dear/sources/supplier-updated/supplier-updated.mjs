import { v4 as uuid } from "uuid";
import constants from "../../common/constants.mjs";
import base from "../common/webhooks.mjs";

export default {
  ...base,
  name: "New Supplier Updated",
  key: "dear-supplier-updated",
  type: "source",
  description: "Emit new event when a supplier is updated. [See the documentation](https://dearinventory.docs.apiary.io/#reference/webhooks)",
  version: "0.0.3",
  methods: {
    ...base.methods,
    getWebhookType() {
      return constants.WEBHOOK_TYPE.SUPPLIER_UPDATED;
    },
    getMetadata(payload) {
      return {
        id: uuid(),
        summary: payload.SupplierDetailsList.map((customer) => customer.Name).join(", "),
        ts: Date.now(),
      };
    },
  },
};
