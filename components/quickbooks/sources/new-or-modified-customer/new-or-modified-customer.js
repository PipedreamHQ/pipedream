const quickbooks = require('../../quickbooks.app');
const common = require('../common')

const entity_name = 'Customer'

const supported_operations = common.methods.getSupportedOperations(entity_name)
const supported_operations_description = common.methods.describeOperations(supported_operations)

module.exports = {
  ...common,
  key: `quickbooks-new-or-modified-${entity_name.toLowerCase()}`,
  name: `New or Modified ${entity_name}`,
  description: `Emits an event when a ${entity_name} is ${supported_operations_description}.`,
  version: '0.0.1',
  props: {
    ...common.props,
    operations_to_emit: {
      propDefinition: [quickbooks, 'operations_to_emit'],
      //list only the options supported by this entity instead of offering all the default options from the propDefinition
      options: common.methods.getSupportedOperations(entity_name),
    },
  },
  methods: {
  	...common.methods,
  },
  async run(event) {
    const entity = this.getEntity(event)
    this.sendHttpResponse(event, entity)

    //reject any events that don't match the entity name or operation (if those options have been selected)
    if(entity.name !== entity_name){
      console.log(`${entity.name} webhook received and ignored, since it is not a ${entity_name}`)
    } else if(this.operations_to_emit.length > 0 && !this.operations_to_emit.includes(entity.operation)){
      console.log(`Operation '${entity.operation}' not found in list of selected Operations`)
    } else {
      this.emitEvent(event, entity)
    }
  },
};
