import loyverse from "../../loyverse.app.mjs";

export default {
  key: "loyverse-new-item-update-instant",
  name: "New Item Update (Instant)",
  description: "Emits a new event when an item is updated in Loyverse.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    loyverse,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    itemIds: {
      propDefinition: [
        loyverse,
        "itemIds",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Fetch and emit the last updated items as historical data
      const items = await this.loyverse.getItemUpdates({
        itemIds: this.itemIds,
      });
      items.forEach((item) => {
        this.$emit(item, {
          id: item.id,
          summary: `Item Updated: ${item.item_name}`,
          ts: Date.parse(item.updated_at),
        });
      });
    },
    async activate() {
      // Placeholder for webhook subscription logic if applicable
    },
    async deactivate() {
      // Placeholder for webhook unsubscription logic if applicable
    },
  },
  methods: {
    async getItemUpdates({ itemIds }) {
      const updatedItems = [];
      for (const itemId of itemIds) {
        const response = await this.loyverse._makeRequest({
          method: "GET",
          path: `/items/${itemId}`,
        });
        if (response.updated_at !== this.db.get(`lastUpdate-${itemId}`)) {
          this.db.set(`lastUpdate-${itemId}`, response.updated_at);
          updatedItems.push(response);
        }
      }
      return updatedItems;
    },
  },
  async run(event) {
    const { body } = event;
    if (!body || !body.item_id || this.itemIds.indexOf(body.item_id) === -1) {
      this.http.respond({
        status: 400,
        body: "Bad Request: Missing or invalid item_id",
      });
      return;
    }

    const itemUpdate = await this.loyverse._makeRequest({
      method: "GET",
      path: `/items/${body.item_id}`,
    });

    this.$emit(itemUpdate, {
      id: itemUpdate.id,
      summary: `Item Updated: ${itemUpdate.item_name}`,
      ts: Date.parse(itemUpdate.updated_at),
    });

    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
