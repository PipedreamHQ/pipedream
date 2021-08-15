const quickbooks = require("../../quickbooks.app");
const common = require("../common");

module.exports = {
  ...common,
  key: "quickbooks-custom-webhook-events",
  name: "Custom Set of Webhook Entities (Created, Updated, Merged, Deleted, Voided or Emailed)",
  description: "Emit events for more than one type of entity (e.g. \"Emailed Invoices and Purchase Orders\" or \"New and Modified Customers and Vendors\"). Visit the documentation page to learn how to configure webhooks for your QuickBooks company: https://developer.intuit.com/app/developer/qbo/docs/develop/webhooks",
  version: "0.0.1",
  props: {
    ...common.props,
    webhook_verifier_token: {
      propDefinition: [
        quickbooks,
        "webhook_verifier_token",
      ],
    },
    names_to_emit: {
      propDefinition: [
        quickbooks,
        "webhook_names",
      ],
    },
    operations_to_emit: {
      propDefinition: [
        quickbooks,
        "webhook_operations",
      ],
    },
  },
  methods: {
    ...common.methods,
    async validateAndEmit(event, entity) {
      // only emit events that match the entity names and operations indicated by the user
      // but if the props are left empty, emit all events rather than filtering them all out
      // (it would a hassle for the user to select every option if they wanted to emit everything)
      if (this.names_to_emit.length > 0 && !this.names_to_emit.includes(entity.name)) {
        console.log(`Entity Type '${entity.name}' not found in list of selected Entity Types`);
      } else if (this.operations_to_emit.length > 0
        && !this.operations_to_emit.includes(entity.operation)) {
        console.log(`Operation '${entity.operation}' not found in list of selected Operations`);
      } else {
        await this.emitEvent(event, entity);
      }
    },
  },
};
