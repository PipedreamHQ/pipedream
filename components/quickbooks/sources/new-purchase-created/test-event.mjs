export default {
  "AccountRef": {
    "value": "35",
    "name": "Checking"
  },
  "PaymentType": "Check",
  "TotalAmt": 1,
  "PrintStatus": "NotSet",
  "PurchaseEx": {
    "any": [
      {
        "name": "{http://schema.intuit.com/finance/v3}NameValue",
        "declaredType": "com.intuit.schema.finance.v3.NameValue",
        "scope": "javax.xml.bind.JAXBElement$GlobalScope",
        "value": {
          "Name": "TxnType",
          "Value": "3"
        },
        "nil": false,
        "globalScope": true,
        "typeSubstituted": false
      }
    ]
  },
  "domain": "QBO",
  "sparse": false,
  "Id": "180",
  "SyncToken": "0",
  "MetaData": {
    "CreateTime": "2025-07-31T07:50:12-07:00",
    "LastUpdatedTime": "2025-07-31T07:50:12-07:00"
  },
  "TxnDate": "2025-07-31",
  "CurrencyRef": {
    "value": "USD",
    "name": "United States Dollar"
  },
  "Line": [
    {
      "Id": "1",
      "Amount": 1,
      "DetailType": "AccountBasedExpenseLineDetail",
      "AccountBasedExpenseLineDetail": {
        "AccountRef": {
          "value": "7",
          "name": "Advertising"
        },
        "BillableStatus": "NotBillable",
        "TaxCodeRef": {
          "value": "NON"
        }
      }
    }
  ]
}