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
      type: "integer",
      label: "Max Number of Usages",
      description: "The maximum number of usage for the discount. If not specified, customers will be able to use this discount indefinitely.",
      optional: true,
    },
    trigger: {
      type: "string",
      label: "Trigger",
      description: "Condition that will trigger the discount",
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
      description: "The type of action that the discount will apply to",
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
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        auth: {
          username: `${this.$auth.api_key}`,
          password: "",
        },
      });
    },
    getDiscount({
      id, ...args
    }) {
      return this._makeRequest({
        path: `/discounts/${id}`,
        ...args,
      });
    },
    createDiscount(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/discounts",
        ...args,
      });
    },
    updateDiscount({
      id, ...args
    }) {
      return this._makeRequest({
        method: "put",
        path: `/discounts/${id}`,
        ...args,
      });
    },
    deleteDiscount({
      id, ...args
    }) {
      return this._makeRequest({
        method: "delete",
        path: `/discounts/${id}`,
        ...args,
      });
    },
    listDiscounts(args = {}) {
      return this._makeRequest({
        path: "/discounts",
        ...args,
      });
    },
  },
};
