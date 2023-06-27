import common from "../common/common.mjs";

export default {
  ...common,
  key: "sellercloud-inventory-updated",
  name: "Inventory Updated",
  description: "Emit new event when an item's inventory level changes. [See the documentation](https://developer.sellercloud.com/dev-article/get-all-orders/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    view: {
      propDefinition: [
        common.props.sellercloud,
        "view",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.paginateEvents({
        resourceFn: this.sellercloud.listProductsByView,
        params: {
          viewID: this.view,
        },
        processParams: {
          isDeploy: true,
        },
      });
    },
  },
  methods: {
    ...common.methods,
    _getProductInventory() {
      return this.db.get("productInventory") || {};
    },
    _setProductInventory(productInventory) {
      this.db.set("productInventory", productInventory);
    },
    generateMeta(product) {
      return {
        id: product.ID,
        summary: product.ProductName,
        ts: Date.parse(product.LastModifiedDate),
      };
    },
    processEvents(products, params = {}) {
      const productInventory = this._getProductInventory();

      for (const product of products) {
        if (!productInventory[product.ID] || product.PhysicalQty !== productInventory[product.ID]) {
          if (!params.isDeploy) {
            this.emitEvent(product);
          }
          productInventory[product.ID] = product.PhysicalQty;
        }
      }

      this._setProductInventory(productInventory);
    },
  },
  async run() {
    await this.paginateEvents({
      resourceFn: this.sellercloud.listProductsByView,
      params: {
        viewID: this.view,
      },
    });
  },
};
