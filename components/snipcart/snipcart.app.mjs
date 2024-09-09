import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "snipcart",
  propDefinitions: {
    discountId: {
      type: "string",
      label: "Discount ID",
      description: "ID of the Discount",
      async options() {
        const discountsIds = await this.listDiscounts();

        return discountsIds.map(({
          id, name,
        }) => ({
          value: id,
          label: name,
        }));
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the discount",
    },
    maxNumberOfUsages: {
      type: "string",
      label: "Max Number of Usages",
      description: "Maximum number of times the discount can be used",
    },
    trigger: {
      type: "string",
      label: "Trigger",
      description: "Trigger condition for the discount",
      options: constants.TRIGGER_OPTIONS,
    },
    code: {
      type: "string",
      label: "Code",
      description: "Code for the discount",
    },
    totalToReach: {
      type: "string",
      label: "Total to Reach",
      description: "Minimum amount required to activate the discount. Required when discount Trigger is `FixedAmount`",
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of action that the discount will apply",
      options: constants.TYPE_OPTIONS,
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "Discount amount. Required when discount type is `FixedAmount`",
    },
    rate: {
      type: "string",
      label: "Rate",
      description: "Discount percentage, i.e.: `10`. Required when discount type is `Rate`",
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.snipcart.com/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        auth: {
          username: `${this.$auth.api_key}`,
          password: "",
        },
      });
    },
    async createDiscount(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/discounts",
        ...args,
      });
    },
    async updateDiscount({
      id, ...args
    }) {
      return this._makeRequest({
        method: "put",
        path: `/discounts/${id}`,
        ...args,
      });
    },
    async deleteDiscount({
      id, ...args
    }) {
      return this._makeRequest({
        method: "delete",
        path: `/discounts/${id}`,
        ...args,
      });
    },
    async listDiscounts(args = {}) {
      return this._makeRequest({
        path: "/discounts",
        ...args,
      });
    },
    async listProducts(args = {}) {
      return this._makeRequest({
        path: "/products",
        ...args,
      });
    },
  },
};
