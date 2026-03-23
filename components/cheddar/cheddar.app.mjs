import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cheddar",
  propDefinitions: {
    productCode: {
      type: "string",
      label: "Product Code",
      description: "The product code of a product in Cheddar. Found under Configuration -> Product Settings in the Cheddar UI",
    },
  },
  methods: {
    _baseUrl() {
      return "https://getcheddar.com/xml";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: {
          username: `${this.$auth.email}`,
          password: `${this.$auth.password}`,
        },
        ...opts,
      });
    },
    listCustomers({
      productCode, ...opts
    }) {
      return this._makeRequest({
        path: `/customers/get/productCode/${productCode}`,
        ...opts,
      });
    },
    listPromotions({
      productCode, ...opts
    }) {
      return this._makeRequest({
        path: `/promotions/get/productCode/${productCode}`,
        ...opts,
      });
    },
    listPricingPlans({
      productCode, ...opts
    }) {
      return this._makeRequest({
        path: `/plans/get/productCode/${productCode}`,
        ...opts,
      });
    },
  },
};
