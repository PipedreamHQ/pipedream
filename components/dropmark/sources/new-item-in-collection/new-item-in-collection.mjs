import dropmark from "../../dropmark.app.mjs";

export default {
  type: "source",
  key: "dropmark-new-item-in-collection",
  name: "New Item in Collection",
  description: "Emits an event when a new item is added to a collection in Dropmark.",
  version: "0.0.{{ts}}",
  dedupe: "unique",
  props: {
    dropmark,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    username: {
      propDefinition: [
        dropmark,
        "username",
      ],
    },
    collectionId: {
      propDefinition: [
        dropmark,
        "collectionId",
      ],
    },
    personalKey: {
      propDefinition: [
        dropmark,
        "personalKey",
      ],
    },
  },
  methods: {
    _getPreviousItems() {
      return this.db.get("previousItems") || [];
    },
    _setPreviousItems(previousItems) {
      this.db.set("previousItems", previousItems);
    },
  },
  hooks: {
    async deploy() {
      // Get the latest items at the time of deployment
      const items = await this.dropmark.getCollectionItems({
        username: this.username,
        collectionId: this.collectionId,
        personalKey: this.personalKey,
      });
      // Store the ID of the latest item
      this.db.set("lastItemId", items[0].id);
    },
  },
  async run() {
    const currentItems = await this.dropmark.getCollectionItems({
      username: this.username,
      collectionId: this.collectionId,
      personalKey: this.personalKey,
    });

    const previousItems = this._getPreviousItems();

    for (const item of currentItems) {
      if (!previousItems.includes(item.id)) {
        this.$emit(item, {
          id: item.id,
          summary: `New item: ${item.name}`,
          ts: Date.now(),
        });
        previousItems.push(item.id);
      }
    }

    this._setPreviousItems(previousItems);
  },
};
