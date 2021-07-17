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

    getOperationsDescription(operations){
      return this.toReadableList(this.toPastTense(operations))
    },

    toPastTense(operations){
      const past_tense_version = {
        Create: 'Created',
        Update: 'Updated',
        Merge: 'Merged',
        Delete: 'Deleted',
        Void: 'Voided',
        Emailed: 'Emailed',
      }
      if(Array.isArray(operations)){
        return operations.map(operation => past_tense_version[operation])
      } else {
        return past_tense_version[operations]
      }
    },

    toReadableList(array){
      // converts an array to a readable list like this: ['Created', 'Updated', 'Merged'] => 'Created, Updated, or Merged'
      const comma_separated_list = array.join(', ')
      const index_after_last_comma = comma_separated_list.lastIndexOf(',') + 1
      if(index_after_last_comma === -1){
        //no commas were found so just return the list
        return comma_separated_list
      } else {
        //add an 'or' after the last comma
        const before_last_comma = comma_separated_list.slice(0, index_after_last_comma)
        const after_last_comma = comma_separated_list.slice(index_after_last_comma)
        return before_last_comma + ' or' + after_last_comma
      }
    },

    sendHttpResponse(event, entities){
      this.http.respond({
        status: 200,
        body: entities,
        headers: {
          'Content-Type': event.headers['Content-Type'],
        },
      })
    },
    
    emitEvent(event, entity){
      const summary = `${entity.name} ${entity.id} ${this.toPastTense(entity.operation)}`
      this.$emit(event.body, {summary})
    }
  },
  async run(event) {
    const {entities} = event.body.eventNotifications[0].dataChangeEvent
    this.sendHttpResponse(event, entities)
    entities.forEach(entity => this.validateAndEmit(event, entity))
  },
}
