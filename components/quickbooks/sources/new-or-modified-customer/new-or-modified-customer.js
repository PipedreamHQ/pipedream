const quickbooks = require('../../quickbooks.app');
const common = require('../common')

const source_entity = {
	name: 'Customer',
	display_name: 'Customer',
}

const supported_operations = common.methods.getSupportedOperations(source_entity.name)
const supported_operations_description = common.methods.describeOperations(supported_operations)

module.exports = {
  ...common,
  key: `quickbooks-new-or-modified-${source_entity.name.toLowerCase()}`,
  name: `${source_entity.display_name} Created, Updated, Merged, Deleted, Voided, or Emailed`,
  description: `Emits an event when a ${source_entity.display_name} is ${supported_operations_description}. Visit the documentation page to learn how to configure webhooks for your QuickBooks company: https://developer.intuit.com/app/developer/qbo/docs/develop/webhooks`,
  version: '0.0.1',
  props: {
    ...common.props,
    operations_to_emit: {
      propDefinition: [quickbooks, 'operations_to_emit'],
      //list only the options supported by this source's entity instead of offering all the default options from the propDefinition
      options: supported_operations,
    },
  },
  methods: {
  	...common.methods,
  },
  async run(event) {
    const webhook_entity = this.getEntity(event)
    this.sendHttpResponse(event, webhook_entity)

    //reject any events that don't match the source entity name or operation (if those options have been selected)
    if(webhook_entity.name !== source_entity.name){
      console.log(`${webhook_entity.name} webhook received and ignored, since it is not a ${source_entity.name}`)
    } else if(this.operations_to_emit.length > 0 && !this.operations_to_emit.includes(webhook_entity.operation)){
      console.log(`Operation '${webhook_entity.operation}' not found in list of selected Operations`)
    } else {
      this.emitEvent(event, webhook_entity)
    }
  },
};
