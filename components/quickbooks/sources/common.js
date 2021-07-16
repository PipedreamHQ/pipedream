const quickbooks = require('../quickbooks.app');

//https://developer.intuit.com/app/developer/qbo/docs/develop/webhooks/entities-and-operations-supported
const supported_webhook_options = {
  Account: ['Create', 'Update', 'Merge', 'Delete'],
  Bill: ['Create', 'Update', 'Delete'],
  BillPayment: ['Create', 'Update', 'Delete', 'Void'],
  Budget: ['Create', 'Update'],
  Class: ['Create', 'Update', 'Merge', 'Delete'],
  CreditMemo: ['Create', 'Update', 'Delete', 'Void', 'Emailed'],
  Currency: ['Create', 'Update'],
  Customer: ['Create', 'Update', 'Merge', 'Delete'],
  Department: ['Create', 'Update', 'Merge'],
  Deposit: ['Create', 'Update', 'Delete'],
  Employee: ['Create', 'Update', 'Merge', 'Delete'],
  Estimate: ['Create', 'Update', 'Delete', 'Emailed'],
  Invoice: ['Create', 'Update', 'Delete', 'Void', 'Emailed'],
  Item: ['Create', 'Update', 'Merge', 'Delete'],
  JournalCode: ['Create', 'Update'],
  JournalEntry: ['Create', 'Update', 'Delete'],
  Payment: ['Create', 'Update', 'Delete', 'Void', 'Emailed'],
  PaymentMethod: ['Create', 'Update', 'Merge'],
  Preferences: ['Update'],
  Purchase: ['Create', 'Update', 'Delete', 'Void'],
  PurchaseOrder: ['Create', 'Update', 'Delete', 'Emailed'],
  RefundReceipt: ['Create', 'Update', 'Delete', 'Void', 'Emailed'],
  SalesReceipt: ['Create', 'Update', 'Delete', 'Void', 'Emailed'],
  TaxAgency: ['Create', 'Update'],
  Term: ['Create', 'Update'],
  TimeActivity: ['Create', 'Update', 'Delete'],
  Transfer: ['Create', 'Update', 'Delete', 'Void'],
  Vendor: ['Create', 'Update', 'Merge', 'Delete'],
  VendorCredit: ['Create', 'Update', 'Delete'],      
}

module.exports = {
  props: {
    quickbooks,
    http: {
      type: '$.interface.http',
      customResponse: true,
    },
  },
  methods: {
    getEntityNames(){
      return Object.keys(supported_webhook_options)
    },
    getSupportedOperations(entity_name){      
      return supported_webhook_options[entity_name]
    },
    describeOperations(operations){
      const descriptive_operation_names = {
        Create: 'created',
        Update: 'updated',
        Merge: 'merged',
        Delete: 'deleted',
        Void: 'voided',
        Emailed: 'emailed',
      }

      if(Array.isArray(operations)){
        //creates a string listing the operations for use in the description: e.g. 'created, updated, merged, deleted'
        return operations.map(operation => descriptive_operation_names[operation]).join(', ')
      } else {
        return descriptive_operation_names[operations]
      }
    },
    getEntity(event){
      return event.body.eventNotifications[0].dataChangeEvent.entities[0]
    },
    sendHttpResponse(event, entity){
      this.http.respond({
        status: 200,
        body: entity,
        headers: {
          'Content-Type': event.headers['Content-Type'],
        },
      })
    },
    emitEvent(event, entity){
      const summary = `${entity.name} ${entity.id} ${this.describeOperations(entity.operation)}`
      this.$emit(event.body, {summary})
    }
  },
}
