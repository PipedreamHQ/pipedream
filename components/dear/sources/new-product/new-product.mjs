import dear from "../../dear.app.mjs";
import {
  pick,
  pickBy,
} from "lodash-es";
import constants from "../../common/constants.mjs";

export default {
  name: "New Product",
  key: "dear-new-product",
  type: "source",
  description: "Emit new event when a product is created",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    dear,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60,
      },
    },
    sku: {
      type: "string",
      label: "Starting with SKU",
      description: "Filter products with the *SKU* starting with this value",
      optional: true,
    },
    name: {
      type: "string",
      label: "Starting with Name",
      description: "Filter products with the *Name* starting with this value",
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      this._setModifiedSince(new Date());
      const params = this._defaultParams();

      console.log(`Retrieving historical products with the following params: ${JSON.stringify(params)}`);
      const products = await this.getProducts(params);
      this.emitEvents(products);
    },
  },
  methods: {
    _defaultParams() {
      const params = pickBy(pick(this, [
        "sku",
        "name",
      ]));
      params.page = 1;
      return params;
    },
    _getModifiedSince() {
      return this.db.get("modifiedSince");
    },
    _setModifiedSince(modifiedSince) {
      this.db.set("modifiedSince", modifiedSince);
    },
    emitEvents(products) {
      if (products.length > 0) {
        console.log("Emiting events...");
        for (const product of products) {
          const meta = this.getMetadata(product);
          this.$emit(product, meta);
        }
      }
    },
    getMetadata(product) {
      const {
        SKU: sku,
        ID: id,
        LastModifiedOn: ts,
        Name: name,
      } = product;

      return {
        id: `${sku}_${id}`,
        ts,
        summary: `New product: ${name}`,
      };
    },
    async getProducts(params) {
      const results = [];

      while (true) {
        console.log(`Retrieving list of products for page ${params.page}`);
        const { Products: products } = await this.dear.listProducts({
          params: {
            ...params,
            limit: constants.PAGE_LIMIT,
          },
        });

        console.log(`Retrieved ${products.length} product(s).`);
        results.push(...products);

        if (products.length < constants.PAGE_LIMIT) {
          console.log("Exausted list of products. Exiting.");
          break;
        }

        console.log("Requesting next page of products.");

        params.page++;
      }

      return results;
    },
  },
  async run() {
    const params = {
      ...this._defaultParams(),
      modifiedSince: this._getModifiedSince(),
    };

    console.log(`Requesting products with the following params: ${JSON.stringify(params)}`);
    const products = await this.getProducts(params);

    if (products.length > 0) {
      const lastModified = products[products.length - 1].LastModifiedOn;
      this._setModifiedSince(lastModified);
      this.emitEvents(products);
    }
  },
};
