// const QuickBooks = require('node-quickbooks')

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
    webhook_entities: {
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
  },
};