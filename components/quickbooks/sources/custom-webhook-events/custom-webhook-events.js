const quickbooks = require("../../quickbooks.app");
const common = require("../common");

module.exports = {
  ...common,
  key: "quickbooks-custom-webhook-events",
  name: "Custom Webhook Events: Created, Updated, Merged, Deleted, Voided or Emailed (Instant)", // eslint-disable-line
  description: "Emit new events for more than one type of entity (e.g. \"Emailed Invoices and Purchase Orders\" or \"New and Modified Customers and Vendors\"). Visit the documentation page to learn how to configure webhooks for your QuickBooks company: https://developer.intuit.com/app/developer/qbo/docs/develop/webhooks",
  version: "0.0.1",
  type: "source",
  props: {
    ...common.props,
    entitiesToEmit: {
      propDefinition: [
        quickbooks,
        "webhookNames",
      ],
    },
    operationsToEmit: {
      propDefinition: [
        quickbooks,
        "webhookOperations",
      ],
    },
  },
  methods: {
    ...common.methods,
    getEntities() {
      return this.entitiesToEmit;
    },
    getOperations() {
      return this.operationsToEmit;
    },
  },
};
