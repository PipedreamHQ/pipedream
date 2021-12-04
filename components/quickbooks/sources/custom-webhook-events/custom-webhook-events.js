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
    namesToEmit: {
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
    async validateAndEmit(entity) {
      // only emit events that match the entity names and operations indicated by the user
      // but if the props are left empty, emit all events rather than filtering them all out
      // (it would a hassle for the user to select every option if they wanted to emit everything)
      if (this.namesToEmit.length > 0 && !this.namesToEmit.includes(entity.name)) {
        console.log(`Entity Type '${entity.name}' not found in list of selected Entity Types`);
        return;
      }
      if (this.operationsToEmit.length > 0
        && !this.operationsToEmit.includes(entity.operation)) {
        console.log(`Operation '${entity.operation}' not found in list of selected Operations`);
        return;
      }
      await this.processEvent(entity);
    },
  },
};
