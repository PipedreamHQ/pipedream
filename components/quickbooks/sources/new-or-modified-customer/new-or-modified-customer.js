const quickbooks = require("../../quickbooks.app");
const common = require("../common");

const sourceEntity = "Customer";

const supportedOperations = common.methods.getSupportedOperations(sourceEntity);

module.exports = {
  ...common,
  key: "quickbooks-new-or-modified-customer",
  name: "New or Modified Customer: Created, Updated, Merged or Deleted (Instant)",
  description: "Emit new or modified customers. Visit the documentation page to learn how to configure webhooks for your QuickBooks company: https://developer.intuit.com/app/developer/qbo/docs/develop/webhooks",
  version: "0.0.1",
  type: "source",
  props: {
    ...common.props,
    operationsToEmit: {
      propDefinition: [
        quickbooks,
        "webhookOperations",
      ],
      // overwrite the default options from the propDefinition to list only the options supported
      // by this source's entity
      options: supportedOperations,
      default: supportedOperations,
    },
  },
  methods: {
    ...common.methods,
    getEntities() {
      return [
        sourceEntity,
      ];
    },
    getOperations() {
      return this.operationsToEmit;
    },
  },
};
