// components/quickbooks/sources/new-bill-updated/test-event.mjs

export default {
  "Id": "123456",
  "SyncToken": "1", // Incremented because this is an update
  "MetaData": {
    "CreateTime": "2023-04-15T10:30:00Z",
    "LastUpdatedTime": "2023-04-16T14:45:00Z" // Different update date
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
  "PrivateNote": "Monthly office supplies - Updated with additional items",
  "TotalAmt": 425.25, // Modified amount
  "DueDate": "2023-05-15",
  "sparse": true, // Indicates this is an update
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
    },
    {
      "Id": "3", // New line added
      "LineNum": 3,
      "Description": "USB Cables",
      "Amount": 74.50,
      "DetailType": "ItemBasedExpenseLineDetail",
      "ItemBasedExpenseLineDetail": {
        "ItemRef": {
          "value": "13",
          "name": "Computer Accessories"
        },
        "Qty": 5,
        "UnitPrice": 14.90
      }
    }
  ]
}