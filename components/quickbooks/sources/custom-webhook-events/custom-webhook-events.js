const common = require('../common')

module.exports = {
  ...common,
  key: 'quickbooks-custom-webhook-events',
  name: 'Custom Webhook Events',
  description: 'Subscribe to one or more event types (i.e. PurchaseOrder created, Invoice emailed) and emit an event on each webhook request. Visit the documentation page to learn how to configure webhooks for your QuickBooks company: https://developer.intuit.com/app/developer/qbo/docs/develop/webhooks',
  version: '0.0.1',
  props: {
    ...common.props,
    operations_to_emit: {
      type: 'string[]',
      label: 'Operations',
      options: ['Create', 'Update', 'Emailed', 'Delete', 'Void'],
      optional: true,
    },
    names_to_emit: {
      type: 'string[]',
      label: 'Entity Types',
      options: [
        'Account',
        'BillPayment',
        'Class',
        'Customer',
        'Employee',
        'Estimate',
        'Invoice',
        'Item',
        'Payment',
        'Purchase',
        'SalesReceipt',
        'Vendor',
        'Bill',
        'CreditMemo',
        'RefundReceipt',
        'VendorCredit',
        'TimeActivity',
        'Department',
        'Deposit',
        'JournalEntry',
        'PaymentMethod',
        'Preferences',
        'PurchaseOrder',
        'TaxAgency',
        'Term',
        'Transfer',
        'Budget',
        'Currency',
        'JournalCode',
      ],
      optional: true,
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

    //reject any events that don't match the operation or entity name (if those options have been selected)
    if(this.operations_to_emit.length > 0 && !this.operations_to_emit.includes(entity.operation)){
      console.log(`Operation '${entity.operation}' not found in list of selected Operations`)
    } else if(this.names_to_emit.length > 0 && !this.names_to_emit.includes(entity.name)){
      console.log(`Name '${entity.name}' not found in list of selected Entity Types`)
    } else {
      this.$emit(event.body, {summary})
    }
  },
};
