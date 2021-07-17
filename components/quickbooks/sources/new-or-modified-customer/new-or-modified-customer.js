const quickbooks = require('../../quickbooks.app');
const common = require('../common')

const source_entity = 'Customer'

const supported_operations = common.methods.getSupportedOperations(source_entity)
const supported_operations_list = common.methods.getOperationsDescription(supported_operations)

module.exports = {
  ...common,
  key: `quickbooks-new-or-modified-customer`,
  name: `New or Modified Customer (${supported_operations_list})`,
  description: `Emits an event when a Customer is ${supported_operations_list.toLowerCase()}. Visit the documentation page to learn how to configure webhooks for your QuickBooks company: https://developer.intuit.com/app/developer/qbo/docs/develop/webhooks`,
  version: '0.0.1',
  props: {
    ...common.props,
    operations_to_emit: {
      propDefinition: [quickbooks, 'operations_to_emit'],
      //overwrite the default options from the propDefinition to list only the options supported by this source's entity
      options: supported_operations,
    },
  },
  methods: {
  	...common.methods,
  },
  async run(event) {
    const webhook_entity = this.getEntity(event)
    this.sendHttpResponse(event, webhook_entity)

    //reject any events that don't match the specified entity name or operation
    if(webhook_entity.name !== source_entity){
      console.log(`${webhook_entity.name} webhook received and ignored, since it is not a Customer`)
    } else if(this.operations_to_emit.length > 0 && !this.operations_to_emit.includes(webhook_entity.operation)){
      console.log(`Operation '${webhook_entity.operation}' not found in list of selected Operations`)
    } else {
      this.emitEvent(event, webhook_entity)
    }
  },
};
