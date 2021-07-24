const quickbooks = require('../../quickbooks.app');
const common = require('../common')

const source_entity = 'Customer'

const supported_operations = common.methods.getSupportedOperations(source_entity)
const supported_operations_list = common.methods.getOperationsDescription(supported_operations)

module.exports = {
  ...common,
  key: `quickbooks-new-or-modified-customer`,
  name: `New or Modified Customer (${supported_operations_list})`,
  description: `Emit Customers that are ${supported_operations_list.toLowerCase()}. Visit the documentation page to learn how to configure webhooks for your QuickBooks company: https://developer.intuit.com/app/developer/qbo/docs/develop/webhooks`,
  version: '0.0.1',
  props: {
    ...common.props,
    webhook_verifier_token: {
      propDefinition: [quickbooks, 'webhook_verifier_token'],
    },
    operations_to_emit: {
      propDefinition: [quickbooks, 'webhook_operations'],
      //overwrite the default options from the propDefinition to list only the options supported by this source's entity
      options: supported_operations,
      default: supported_operations,
    },
  },
  methods: {
  	...common.methods,
    async validateAndEmit(event, entity){
      //only emit events that match the specified entity name and operation
      // but if the operations prop is left empty, emit all events rather than filtering them all out
      // (it would a hassle for the user to select every single option if they wanted to emit everything)
      if(entity.name !== source_entity){
        console.log(`${entity.name} webhook received and ignored, since it is not a Customer`)
      } else if(this.operations_to_emit.length > 0 && !this.operations_to_emit.includes(entity.operation)){
        console.log(`Operation '${entity.operation}' not found in list of selected Operations`)
      } else {
        await this.emitEvent(event, entity)
      }
    },
  },
};
