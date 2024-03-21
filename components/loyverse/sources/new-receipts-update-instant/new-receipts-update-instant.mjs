import loyverse from "../../loyverse.app.mjs";

export default {
  key: "loyverse-new-receipts-update-instant",
  name: "New Receipts Update Instant",
  description: "Emits an event for each new or updated receipt in Loyverse.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    loyverse,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    storeId: {
      propDefinition: [
        loyverse,
        "storeId",
      ],
    },
    customerId: {
      propDefinition: [
        loyverse,
        "customerId",
        (c) => ({
          storeId: c.storeId,
        }),
      ],
      optional: true,
    },
    itemIds: {
      propDefinition: [
        loyverse,
        "itemIds",
      ],
      optional: true,
    },
    paymentDetails: {
      propDefinition: [
        loyverse,
        "paymentDetails",
      ],
      optional: true,
    },
    variantQuantities: {
      propDefinition: [
        loyverse,
        "variantQuantities",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Fetch the 50 most recent receipts to populate the db with their ids
      const receipts = await this.loyverse.getReceipts({
        storeId: this.storeId,
        limit: 50,
      });

      // Assume the getReceipts method returns an array of receipts
      receipts.forEach((receipt) => {
        this.db.set(`receiptId_${receipt.receipt_number}`, receipt.receipt_number);
      });
    },
    async activate() {
      console.log("Activate hook called - Simulating webhook subscription creation");
    },
    async deactivate() {
      console.log("Deactivate hook called - Simulating webhook subscription deletion");
    },
  },
  async run(event) {
    const eventData = event.body;
    if (!eventData) {
      this.http.respond({
        status: 400,
        body: "No event data found",
      });
      return;
    }

    if (eventData.store_id === this.storeId) {
      const receiptIdKey = `receiptId_${eventData.receipt_number}`;
      const lastReceiptId = this.db.get(receiptIdKey);
      if (!lastReceiptId) {
        this.$emit(eventData, {
          id: eventData.receipt_number || `${Date.now()}`,
          summary: `Receipt ${eventData.receipt_number} updated or created`,
          ts: eventData.created_at
            ? Date.parse(eventData.created_at)
            : Date.now(),
        });
        this.db.set(receiptIdKey, eventData.receipt_number);
      }
    }

    this.http.respond({
      status: 200,
      body: "Event processed",
    });
  },
};
