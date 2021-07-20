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
    // getEntityNames(){
    //   return Object.keys(supported_webhook_options)
    // },

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
      const list = array.join(', ')
      const index_after_last_comma = list.lastIndexOf(',') + 1
      if(index_after_last_comma === 0){
        //no commas were found so just return the list
        return list
      } else {
        //add an 'or' after the last comma
        return list.slice(0, index_after_last_comma) + ' or' + list.slice(index_after_last_comma)
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

    async validateAndEmit(event, entity){
      //individual source modules can redefine this method to specify criteria for which events to emit
      return this.emitEvent(event, entity)
    },
    
    async emitEvent(event, entity){
      const token = this.webhook_verifier_token
      const payload = event.bodyRaw
      const header = event.headers['intuit-signature']
      const isWebhookValid = this.quickbooks.verifyWebhookRequest(token, payload, header)
      console.log(isWebhookValid)
      if(isWebhookValid){
        const record_details = await this.quickbooks.getRecordDetails(entity.name, entity.id)
        const summary = `${entity.name} ${entity.id} ${this.toPastTense(entity.operation)}`
        this.$emit(record_details, {summary})
        return record_details
      }
    },

    verifyWebhookRequest(token, payload, header){
      const hash = createHmac("sha256", token).update(payload).digest('hex')
      const converted_header = Buffer.from(header, 'base64').toString('hex')
      // console.log('Payload: ', payload)
      // console.log('Header: ', converted_header)
      // console.log('Hash: ', hash)
      return hash === converted_header
    },
  },
  async run(event) {
    const {entities} = event.body.eventNotifications[0].dataChangeEvent
    this.sendHttpResponse(event, entities)
    await Promise.all(entities.map(entity => this.validateAndEmit(event, entity)))
  },
}
