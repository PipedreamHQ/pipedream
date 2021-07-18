// const QuickBooks = require('node-quickbooks')
const axios = require('axios')

const WEBHOOK_OPERATIONS = [
  'Create',
  'Update',
  'Merge',
  'Delete',
  'Void',
  'Emailed',
]

module.exports = {
  type: "app",
  app: "quickbooks",
  propDefinitions: {
    webhook_names: {
      type: 'string[]',
      label: 'Entities',
      description: 'Select which QuickBooks entities to emit or just leave it blank to emit them all.',
      options: [
        'Account',
        'Bill',
        'BillPayment',
        'Budget',
        'Class',
        'CreditMemo',
        'Currency',
        'Customer',
        'Department',
        'Deposit',
        'Employee',
        'Estimate',
        'Invoice',
        'Item',
        'JournalCode',
        'JournalEntry',
        'Payment',
        'PaymentMethod',
        'Preferences',
        'Purchase',
        'PurchaseOrder',
        'RefundReceipt',
        'SalesReceipt',
        'TaxAgency',
        'Term',
        'TimeActivity',
        'Transfer',
        'Vendor',
        'VendorCredit',
      ],
      optional: true,
    },
    webhook_operations: {
      type: 'string[]',
      label: 'Operations',
      description: 'Select which operations to emit or just leave it blank to emit them all.',
      options: WEBHOOK_OPERATIONS,
      default: WEBHOOK_OPERATIONS,
      optional: true,
    },
  },
  methods: {
    async getRecordDetails(endpoint, id){
      // const config = {
      //   url: `https://quickbooks.api.intuit.com/v3/company/${this.$auth.company_id}/${endpoint}/${id}`,
      //   headers: {
      //     Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      //     "accept": `application/json`,
      //     "content-type": `application/json`,
      //   },
      // }
      // return await axios(config)
    },
  },
};
