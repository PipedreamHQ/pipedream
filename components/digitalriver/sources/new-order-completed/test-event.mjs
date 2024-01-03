export default {
  "id": "123456-1234-1234-1234-123456789",
  "type": "order.accepted",
  "data": {
    "object": {
      "id": "1234567890",
      "createdTime": "2023-12-29T15:35:08Z",
      "currency": "USD",
      "email": "email@test.com",
      "shipTo": {
        "address": {
          "line1": "address 01",
          "city": "city",
          "postalCode": "12345",
          "state": "NY",
          "country": "US"
        },
        "name": "name",
        "phone": "123456789"
      },
      "shipFrom": {
        "address": {
          "line1": "address 01",
          "city": "new york",
          "postalCode": "12345",
          "state": "New York",
          "country": "US"
        }
      },
      "billTo": {
        "address": {
          "line1": "address 01",
          "city": "New York",
          "postalCode": "12345",
          "state": "NY",
          "country": "US"
        },
        "name": "name",
        "phone": "123456789",
        "email": "email@test.com"
      },
      "totalAmount": 10.8,
      "subtotal": 10,
      "totalFees": 0,
      "totalTax": 0.8,
      "totalImporterTax": 0,
      "totalDuty": 0,
      "totalDiscount": 0,
      "totalShipping": 0,
      "items": [
        {
          "id": "1234567890",
          "skuId": "sku_01",
          "productDetails": {
            "id": "sku_01",
            "name": "Product 01",
            "eccn": "EAR99",
            "taxCode": "PB0010504",
            "image": "https://cdn.pixabay.com/photo/2014/06/03/19/38/road-sign-361514_1280.png",
            "skuGroupId": "123456-1234-1234-1234-123456789",
            "weight": 123,
            "weightUnit": "g",
            "description": "description test",
            "countryOfOrigin": "BR",
            "partNumber": "1234567890",
            "itemBreadcrumb": "group > class > item"
          },
          "amount": 10,
          "quantity": 1,
          "metadata": {
            "shippingAmount": 0
          },
          "state": "created",
          "stateTransitions": {
            "created": "2023-12-29T15:35:09Z"
          },
          "tax": {
            "rate": 0.08,
            "amount": 0.8
          },
          "importerTax": {
            "amount": 0
          },
          "duties": {
            "amount": 0
          },
          "fees": {
            "amount": 0,
            "taxAmount": 0
          },
          "shipping": {
            "amount": 0,
            "taxAmount": 0
          }
        }
      ],
      "shippingChoice": {
        "id": "12345",
        "amount": 0,
        "description": "description test",
        "serviceLevel": "",
        "taxAmount": 0
      },
      "updatedTime": "2023-12-29T15:35:56Z",
      "browserIp": "123.123.12.12",
      "locale": "en",
      "customerType": "individual",
      "sellingEntity": {
        "id": "DR_INC-ENTITY",
        "name": "Digital River Inc."
      },
      "liveMode": true,
      "payment": {
        "charges": [
          {
            "id": "123456-1234-1234-1234-123456789",
            "createdTime": "2023-12-29T15:35:49Z",
            "currency": "USD",
            "amount": 10.8,
            "state": "capturable",
            "captured": false,
            "refunded": false,
            "sourceId": "123456-1234-1234-1234-123456789",
            "type": "customer_initiated"
          }
        ],
        "sources": [
          {
            "id": "123456-1234-1234-1234-123456789",
            "type": "wireTransfer",
            "amount": 10.8,
            "owner": {
              "firstName": "First Name",
              "lastName": "Last Name",
              "email": "email@test.com",
              "address": {
                "line1": "address 01",
                "city": "New York",
                "postalCode": "12345",
                "state": "NY",
                "country": "US"
              }
            },
            "wireTransfer": {
              "accountHolder": "Global Collect BV",
              "bankName": "Rabobank N.A.",
              "city": "Ontario",
              "country": "US",
              "referenceId": "1234567890",
              "accountNumber": "123456789",
              "additionalBankInformation": "Code guichet: 0001 Code banque: 18739",
              "iban": "ES12 1234 1234 1234 1234 1234",
              "swiftCode": "RABOUS123456",
              "completeFormattedAccount": "1234 1234 12 123456789"
            }
          }
        ],
        "session": {
          "id": "123456-1234-1234-1234-123456789",
          "amountContributed": 10.8,
          "amountRemainingToBeContributed": 0,
          "state": "complete",
          "clientSecret": "c123456-1234-1234-1234-123456789c_123456-1234-1234-1234-123456789",
          "nextAction": {
            "action": "show_payment_instructions",
            "data": {
              "sourceId": "123456-1234-1234-1234-123456789",
              "sourceClientSecret": "123456-1234-1234-1234-123456789-123456-1234-1234-1234-123456789"
            }
          }
        }
      },
      "state": "accepted",
      "stateTransitions": {
        "accepted": "2023-12-29T15:35:56Z",
        "pending_payment": "2023-12-29T15:35:10Z"
      },
      "fraudState": "passed",
      "fraudStateTransitions": {
        "passed": "2023-12-29T15:35:56Z"
      },
      "requestToBeForgotten": false,
      "capturedAmount": 0,
      "cancelledAmount": 0,
      "availableToRefundAmount": 0,
      "checkoutId": "123456-1234-1234-1234-123456789"
    }
  },
  "liveMode": true,
  "createdTime": "2023-12-29T15:35:56.952982Z[UTC]"
}