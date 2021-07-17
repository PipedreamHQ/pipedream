const quickbooks = require('../../quickbooks.app');
const common = require('../common')

module.exports = {
  ...common,
  key: 'quickbooks-custom-webhook-events',
  name: 'Custom Set of Webhook Entities (Created, Updated, Merged, Deleted, Voided or Emailed)',
  description: 'Emit events for more than one type of entity (e.g. "Emailed Invoices and Purchase Orders" or "New and Modified Customers and Vendors"). Visit the documentation page to learn how to configure webhooks for your QuickBooks company: https://developer.intuit.com/app/developer/qbo/docs/develop/webhooks',
  version: '0.0.1',
  props: {
    ...common.props,
    names_to_emit: {
      propDefinition: [quickbooks, 'webhook_names'],
    },
    operations_to_emit: {
      propDefinition: [quickbooks, 'webhook_operations'],
    },
  },
  methods:{
    ...common.methods,
    validateAndEmit(event, entity){
      //reject any events that don't match the entity name or operation (if those options have been selected)
      if(this.names_to_emit.length > 0 && !this.names_to_emit.includes(entity.name)){
        console.log(`Entity Type '${entity.name}' not found in list of selected Entity Types`)
      } else if(this.operations_to_emit.length > 0 && !this.operations_to_emit.includes(entity.operation)){
        console.log(`Operation '${entity.operation}' not found in list of selected Operations`)
      } else {
        this.emitEvent(event, entity)
      }
   }
  },

};
