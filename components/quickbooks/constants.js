const WEBHOOK_ENTITIES = [
  "Account",
  "Bill",
  "BillPayment",
  "Budget",
  "Class",
  "CreditMemo",
  "Currency",
  "Customer",
  "Department",
  "Deposit",
  "Employee",
  "Estimate",
  "Invoice",
  "Item",
  "JournalCode",
  "JournalEntry",
  "Payment",
  "PaymentMethod",
  "Preferences",
  "Purchase",
  "PurchaseOrder",
  "RefundReceipt",
  "SalesReceipt",
  "TaxAgency",
  "Term",
  "TimeActivity",
  "Transfer",
  "Vendor",
  "VendorCredit",
];

const WEBHOOK_OPERATIONS = [
  "Create",
  "Update",
  "Merge",
  "Delete",
  "Void",
  "Emailed",
];

// The below list is based on the table shown in Step 3 of the Intuit webhooks documentation
// https://developer.intuit.com/app/developer/qbo/docs/develop/webhooks#set-up-oauth
const SUPPORTED_WEBHOOK_OPERATIONS = {
  Account: [
    "Create",
    "Update",
    "Merge",
    "Delete",
  ],
  Bill: [
    "Create",
    "Update",
    "Delete",
  ],
  BillPayment: [
    "Create",
    "Update",
    "Delete",
    "Void",
  ],
  Budget: [
    "Create",
    "Update",
  ],
  Class: [
    "Create",
    "Update",
    "Merge",
    "Delete",
  ],
  CreditMemo: [
    "Create",
    "Update",
    "Delete",
    "Void",
    "Emailed",
  ],
  Currency: [
    "Create",
    "Update",
  ],
  Customer: [
    "Create",
    "Update",
    "Merge",
    "Delete",
  ],
  Department: [
    "Create",
    "Update",
    "Merge",
  ],
  Deposit: [
    "Create",
    "Update",
    "Delete",
  ],
  Employee: [
    "Create",
    "Update",
    "Merge",
    "Delete",
  ],
  Estimate: [
    "Create",
    "Update",
    "Delete",
    "Emailed",
  ],
  Invoice: [
    "Create",
    "Update",
    "Delete",
    "Void",
    "Emailed",
  ],
  Item: [
    "Create",
    "Update",
    "Merge",
    "Delete",
  ],
  JournalCode: [
    "Create",
    "Update",
  ],
  JournalEntry: [
    "Create",
    "Update",
    "Delete",
  ],
  Payment: [
    "Create",
    "Update",
    "Delete",
    "Void",
    "Emailed",
  ],
  PaymentMethod: [
    "Create",
    "Update",
    "Merge",
  ],
  Preferences: [
    "Update",
  ],
  Purchase: [
    "Create",
    "Update",
    "Delete",
    "Void",
  ],
  PurchaseOrder: [
    "Create",
    "Update",
    "Delete",
    "Emailed",
  ],
  RefundReceipt: [
    "Create",
    "Update",
    "Delete",
    "Void",
    "Emailed",
  ],
  SalesReceipt: [
    "Create",
    "Update",
    "Delete",
    "Void",
    "Emailed",
  ],
  TaxAgency: [
    "Create",
    "Update",
  ],
  Term: [
    "Create",
    "Update",
  ],
  TimeActivity: [
    "Create",
    "Update",
    "Delete",
  ],
  Transfer: [
    "Create",
    "Update",
    "Delete",
    "Void",
  ],
  Vendor: [
    "Create",
    "Update",
    "Merge",
    "Delete",
  ],
  VendorCredit: [
    "Create",
    "Update",
    "Delete",
  ],
};

module.exports = {
  WEBHOOK_ENTITIES,
  WEBHOOK_OPERATIONS,
  SUPPORTED_WEBHOOK_OPERATIONS,
};
