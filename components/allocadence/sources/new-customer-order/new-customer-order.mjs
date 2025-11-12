import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "allocadence-new-customer-order",
  name: "New Customer Order Created",
  description: "Emit new event when a new customer order is created.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    prepareData({
      responseArray, fieldDate, maxResults,
    }) {
      responseArray.reverse();
      if (responseArray.length) {
        if (maxResults && responseArray.length > maxResults) {
          responseArray.length = maxResults;
        }
        this._setLastDate(responseArray[0][fieldDate]);
      }
      return responseArray;
    },
    getParams(orderedDate) {
      return {
        orderedDate,
        orderedDateConditional: "on_or_after",
      };
    },
    getFunction() {
      return this.allocadence.listCustomerOrder;
    },
    getDataField() {
      return "customerOrders";
    },
    getFieldDate() {
      return "orderedDate";
    },
    getSummary(item) {
      return `New Customer Order: ${item.orderNumber}`;
    },
  },
  sampleEmit,
};
