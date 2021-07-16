const common = require('../common')

module.exports = {
  ...common,
  key: 'quickbooks-custom-webhook-events',
  name: 'Custom Webhook Events',
  description: 'Specify your own combination of entities and operations (i.e. Bills and Invoices — Created and Updated) to emit an event for each matching webhook request. Visit the documentation page to learn how to configure webhooks for your QuickBooks company: https://developer.intuit.com/app/developer/qbo/docs/develop/webhooks',
  version: '0.0.1',
  props: {
    ...common.props,
    names_to_emit: {
      type: 'string[]',
      label: 'Entities',
      description: 'Select which QuickBooks entities to emit. If you want to emit them all you can just leave this field blank.',
      options: common.methods.getEntityNames(),
      optional: true,
    },
    operations_to_emit: {
      propDefinition: [github, 'operations_to_emit'],
    },
  },
  async run(event) {
    const entity = event.body.eventNotifications[0].dataChangeEvent.entities[0]
    const summary = `${entity.name} ${entity.id} ${entity.operation}`

    this.http.respond({
      status: 200,
      body: entity,
      headers: {
        'Content-Type': event.headers['Content-Type'],
      },
    });

    //reject any events that don't match the entity name or operation (if those options have been selected)
    if(this.names_to_emit.length > 0 && !this.names_to_emit.includes(entity.name)){
      console.log(`Name '${entity.name}' not found in list of selected Entity Types`)
    } else if(this.operations_to_emit.length > 0 && !this.operations_to_emit.includes(entity.operation)){
      console.log(`Operation '${entity.operation}' not found in list of selected Operations`)
    } else {
      this.$emit(event.body, {summary})
    }
  },
};
