// components/quickbooks/sources/new-bill-created/test-event.mjs

export default {
  "Id": "123456",
  "SyncToken": "0",
  "MetaData": {
    "CreateTime": "2023-04-15T10:30:00Z",
    "LastUpdatedTime": "2023-04-15T10:30:00Z"
  },
  "VendorRef": {
    "value": "56789",
    "name": "Acme Supplies"
  },
  "APAccountRef": {
    "value": "33",
    "name": "Accounts Payable"
  },
  "TxnDate": "2023-04-15",
  "CurrencyRef": {
    "value": "CAD",
    "name": "Canadian Dollar"
  },
  "PrivateNote": "Monthly office supplies",
  "TotalAmt": 350.75,
  "DueDate": "2023-05-15",
  "sparse": false,
  "Line": [
    {
      "Id": "1",
      "LineNum": 1,
      "Description": "Paper supplies",
      "Amount": 150.50,
      "DetailType": "ItemBasedExpenseLineDetail",
      "ItemBasedExpenseLineDetail": {
        "ItemRef": {
          "value": "11",
          "name": "Office Supplies"
        },
        "Qty": 5,
        "UnitPrice": 30.10
      }
    },
    {
      "Id": "2",
      "LineNum": 2,
      "Description": "Printer ink",
      "Amount": 200.25,
      "DetailType": "ItemBasedExpenseLineDetail",
      "ItemBasedExpenseLineDetail": {
        "ItemRef": {
          "value": "12",
          "name": "Printing Supplies"
        },
        "Qty": 3,
        "UnitPrice": 66.75
      }
    }
  ]
}