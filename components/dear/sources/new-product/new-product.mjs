import {
  pick,
  pickBy,
} from "lodash-es";
import constants from "../../common/constants.mjs";
import base from "../common/polling.mjs";

export default {
  ...base,
  name: "New Product",
  key: "dear-new-product",
  type: "source",
  description: "Emit new event when a product is created",
  version: "0.0.5",
  dedupe: "unique",
  props: {
    ...base.props,
    sku: {
      type: "string",
      label: "“SKU” Starts With”",
      description: "Filter products with the *SKU* starting with this value",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name Starts With",
      description: "Filter products with the *Name* starting with this value",
      optional: true,
    },
  },
  methods: {
    ...base.methods,
    defaultParams() {
      const params = pickBy(pick(this, [
        "sku",
        "name",
      ]));
      params.page = 1;
      return params;
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
    async pollFunction(params) {
      const data = [];

      while (true) {
        console.log(`Retrieving list of products for page ${params.page}`);
        const { Products: products } = await this.dear.listProducts({
          params: {
            ...params,
            limit: params.limit || constants.PAGE_LIMIT,
          },
        });

        console.log(`Retrieved ${products.length} product(s).`);
        data.push(...products);

        if (products.length < constants.PAGE_LIMIT) {
          console.log("Exausted list of products. Exiting.");
          break;
        }

        console.log("Requesting next page of products.");
        params.page++;
      }

      return data;
    },
  },
};
