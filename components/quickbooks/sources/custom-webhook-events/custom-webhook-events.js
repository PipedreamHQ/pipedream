const quickbooks = require('../../quickbooks.app');
const common = require('../common')

module.exports = {
  ...common,
  key: 'quickbooks-custom-webhook-events',
  name: 'Custom Set of Webhook Entities (Create, Update, Merge, Delete, Void, Emailed)',
  description: 'Specify your own combination of entities and operations (i.e. Created or Updated Customers and Vendors) to emit an event for each matching webhook request. Visit the documentation page to learn how to configure webhooks for your QuickBooks company: https://developer.intuit.com/app/developer/qbo/docs/develop/webhooks',
  version: '0.0.1',
  props: {
    ...common.props,
    names_to_emit: {
      type: 'string[]',
      label: 'Entities',
      description: 'Select which QuickBooks entities to emit or just leave it blank to emit them all.',
      options: common.methods.getEntityNames(),
      optional: true,
    },
    operations_to_emit: {
      propDefinition: [quickbooks, 'operations_to_emit'],
    },
  },
  methods:{
    ...common.methods,
  },
  async run(event) {
    const webhook_entity = this.getEntity(event)
    this.sendHttpResponse(event, webhook_entity)

    //reject any events that don't match the entity name or operation (if those options have been selected)
    if(this.names_to_emit.length > 0 && !this.names_to_emit.includes(webhook_entity.name)){
      console.log(`Entity Type '${webhook_entity.name}' not found in list of selected Entity Types`)
    } else if(this.operations_to_emit.length > 0 && !this.operations_to_emit.includes(webhook_entity.operation)){
      console.log(`Operation '${webhook_entity.operation}' not found in list of selected Operations`)
    } else {
      this.emitEvent(event, webhook_entity)
    }
  },
};
