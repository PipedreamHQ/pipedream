export default {
  "event": "sales_order.approved_or_denied",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "accountId": "123e4567-e89b-12d3-a456-426614174000",
    "orderNumber": "string",
    "isExchange": false,
    "relatedExchangeOrderNumber": "string",
    "consumer": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "orderNumber": "string",
      "postalCode": "string",
      "email": "A@A.AA",
      "locale": "string",
      "shippingAddress": {
        "firstName": "string",
        "lastName": "string",
        "street": "string",
        "city": "string",
        "postalCode": "string",
        "countryCode": "AA",
        "stateProvinceCode": "string"
      },
      "billingAddress": {
        "firstName": "string",
        "lastName": "string",
        "street": "string",
        "city": "string",
        "postalCode": "string",
        "countryCode": "AA",
        "stateProvinceCode": "string"
      },
      "firstName": "string",
      "lastName": "string",
      "storeId": "123e4567-e89b-12d3-a456-426614174000",
      "store": {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "name": "string"
      }
    },
    "returnRequests": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "returnOrderId": "123e4567-e89b-12d3-a456-426614174000",
        "consumerId": "123e4567-e89b-12d3-a456-426614174000",
        "returnReasonId": "123e4567-e89b-12d3-a456-426614174000",
        "returnReasonComment": "AAAAAA",
        "returnReasonMeta": {
          "property1": null,
          "property2": null
        },
        "purchaseId": "19d8c970-c1f0-4000-892b-898162da9a01",
        "parentPurchaseId": "string",
        "purchaseOrderNumber": "123456",
        "purchaseOrderId": "string",
        "purchasePrice": {
          "value": "string",
          "currency": "string"
        },
        "requestedResolution": "Refund",
        "status": "Open",
        "product": {
          "id": "string",
          "name": "RETURNISTA | CLASSIC BACKPACK",
          "sku": "RN-00-black-L-akl-kk",
          "price": {
            "value": "string",
            "currency": "string"
          },
          "categories": [
            "string"
          ],
          "imageUrls": [
            "string"
          ],
          "thumbnailUrl": "string",
          "attributes": [
            {
              "name": "string",
              "value": "string"
            }
          ],
          "legacyKey": "RN-00-black-L-akl-kk",
          "barcode": "string"
        },
        "exchangeProduct": {
          "id": "string",
          "name": "RETURNISTA | CLASSIC BACKPACK",
          "sku": "RN-00-black-L-akl-kk",
          "price": {
            "value": "string",
            "currency": "string"
          },
          "categories": [
            "string"
          ],
          "imageUrls": [
            "string"
          ],
          "thumbnailUrl": "string",
          "attributes": [
            {
              "name": "string",
              "value": "string"
            }
          ],
          "legacyKey": "RN-00-black-L-akl-kk",
          "barcode": "string"
        },
        "resolution": {
          "type": "Refund",
          "value": {
            "value": "string",
            "currency": "string"
          },
          "status": "Open",
          "denialReason": "ITEM_NOT_IN_ORIGINAL_CONDITION",
          "selectableResolutionTypes": [
            "Refund"
          ],
          "restockLocationId": "string"
        },
        "createdAt": "0020-02-29T00:00Z",
        "updatedAt": "0020-02-29T00:00Z",
        "storeId": "123e4567-e89b-12d3-a456-426614174000",
        "lastUpdatedBy": {
          "id": "123e4567-e89b-12d3-a456-426614174000",
          "type": "user",
          "name": "John Doe",
          "email": "john.doe@example.com"
        },
        "returnReason": {
          "id": "123e4567-e89b-12d3-a456-426614174000",
          "key": "return_reasons.doesnt_look_good",
          "details": {
            "visible": false
          },
          "description": "string",
          "default": false
        },
        "consumer": {
          "id": "123e4567-e89b-12d3-a456-426614174000",
          "orderNumber": "string",
          "postalCode": "string",
          "email": "A@A.AA",
          "locale": "string",
          "shippingAddress": {
            "firstName": "string",
            "lastName": "string",
            "street": "string",
            "city": "string",
            "postalCode": "string",
            "countryCode": "AA",
            "stateProvinceCode": "string"
          },
          "billingAddress": {
            "firstName": "string",
            "lastName": "string",
            "street": "string",
            "city": "string",
            "postalCode": "string",
            "countryCode": "AA",
            "stateProvinceCode": "string"
          },
          "firstName": "string",
          "lastName": "string",
          "storeId": "123e4567-e89b-12d3-a456-426614174000",
          "store": {
            "id": "123e4567-e89b-12d3-a456-426614174000",
            "name": "string"
          }
        }
      }
    ],
    "totalAmount": {
      "value": "string",
      "currency": "string"
    },
    "shipments": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "returnOrderId": "123e4567-e89b-12d3-a456-426614174000",
        "shippingProductId": "123e4567-e89b-12d3-a456-426614174000",
        "shippingOptionId": "123e4567-e89b-12d3-a456-426614174000",
        "status": "New",
        "reason": "CreatedByConsumer",
        "receiver": {
          "id": "123e4567-e89b-12d3-a456-426614174000",
          "name": "string",
          "companyName": "string",
          "attention": "string",
          "contactName": "string",
          "phoneNumber": "string",
          "address": {
            "street": "string",
            "houseNumber": "string",
            "suffix": "string",
            "city": "string",
            "postalCode": "string",
            "countryCode": "AF",
            "stateProvinceCode": "string"
          }
        },
        "sender": {
          "firstName": "string",
          "lastName": "string",
          "street": "string",
          "houseNumber": "string",
          "city": "string",
          "postalCode": "string",
          "countryCode": "string"
        },
        "labelUrl": "string",
        "labelBarcode": "string",
        "trackingUrl": "string",
        "trackingNumber": "string",
        "trackingUpdates": [
          {
            "status": "New",
            "explanation": "string",
            "happenedAt": "0020-02-29T00:00Z",
            "createdAt": "0020-02-29T00:00Z"
          }
        ],
        "errorCode": "string",
        "errorMessage": "string",
        "createdAt": "0020-02-29T00:00Z",
        "updatedAt": "0020-02-29T00:00Z",
        "shippingProduct": {
          "id": "123e4567-e89b-12d3-a456-426614174000",
          "name": "string",
          "productCode": "string",
          "logoUrl": "string",
          "shippingMethod": "CARRIER_INTEGRATION",
          "labelType": "REQUIRED",
          "key": "string"
        }
      }
    ],
    "relatedReturnOrders": [
      {
        "id": "01944129-2796-718d-a7f9-e49cb8081ac5",
        "storeId": "01944129-2796-718d-a7f9-e49cb8081ac5",
        "consumerId": "01944129-2796-718d-a7f9-e49cb8081ac5",
        "shippingOptionId": "01944129-2796-718d-a7f9-e49cb8081ac5",
        "totalPrice": {
          "value": "string",
          "currency": "string"
        },
        "shippingFee": {
          "value": "string",
          "currency": "string"
        },
        "returnRequestFee": {
          "value": "string",
          "currency": "string"
        },
        "returnRequestFeeSnapshot": {
          "returnRequestFee": {
            "value": "string",
            "currency": "string"
          },
          "returnRequestFeeThreshold": 0
        },
        "returnRequestsCharged": 0,
        "returnRequestCount": 0,
        "createdAt": "0020-02-29T00:00Z",
        "updatedAt": "0020-02-29T00:00Z",
        "relationUpdatedAt": "0020-02-29T00:00Z",
        "insuranceQuote": {
          "price": {
            "value": "string",
            "currency": "string"
          },
          "coverage": {
            "value": "string",
            "currency": "string"
          },
          "totalPaidAmountOfSelectedPurchases": {
            "value": "string",
            "currency": "string"
          }
        },
        "storeCreditQuote": {
          "totalAmount": {
            "value": "string",
            "currency": "string"
          },
          "incentive": {
            "amount": {
              "value": "string",
              "currency": "string"
            },
            "maximumAmount": {
              "value": "string",
              "currency": "string"
            },
            "percentage": 0,
            "type": "FixedAmount",
            "exchangeRate": "string"
          }
        },
        "appliedVouchers": [
          {
            "id": "123e4567-e89b-12d3-a456-426614174000",
            "status": "NEW",
            "applicableTo": [
              "SHIPPING_FEE"
            ]
          }
        ],
        "purchaseOrderNumbers": [
          "string"
        ],
        "tags": [
          "string"
        ],
        "source": "ReturnsPortal",
        "status": "Pending",
        "paymentStatus": "Open",
        "comments": [
          {
            "name": "string",
            "content": "string",
            "createdAt": "string"
          }
        ],
        "createdFromRequest": false,
        "createdWithoutShipment": false,
        "consumer": {
          "id": "123e4567-e89b-12d3-a456-426614174000",
          "orderNumber": "string",
          "postalCode": "string",
          "email": "A@A.AA",
          "locale": "string",
          "shippingAddress": {
            "firstName": "string",
            "lastName": "string",
            "street": "string",
            "city": "string",
            "postalCode": "string",
            "countryCode": "AA",
            "stateProvinceCode": "string"
          },
          "billingAddress": {
            "firstName": "string",
            "lastName": "string",
            "street": "string",
            "city": "string",
            "postalCode": "string",
            "countryCode": "AA",
            "stateProvinceCode": "string"
          },
          "firstName": "string",
          "lastName": "string",
          "storeId": "123e4567-e89b-12d3-a456-426614174000",
          "store": {
            "id": "123e4567-e89b-12d3-a456-426614174000",
            "name": "string"
          }
        },
        "returnRequests": [
          {
            "id": "123e4567-e89b-12d3-a456-426614174000",
            "returnReasonId": "123e4567-e89b-12d3-a456-426614174000",
            "returnReasonComment": "AAAAAA",
            "purchaseId": "string",
            "purchaseOrderNumber": "string",
            "purchasePrice": {
              "value": "string",
              "currency": "string"
            },
            "requestedResolution": "Refund",
            "status": "Open",
            "product": {
              "id": "string",
              "name": "RETURNISTA | CLASSIC BACKPACK",
              "sku": "RN-00-black-L-akl-kk",
              "price": {
                "value": "string",
                "currency": "string"
              },
              "barcode": "string"
            },
            "exchangeProduct": {
              "id": "string",
              "name": "RETURNISTA | CLASSIC BACKPACK",
              "sku": "RN-00-black-L-akl-kk",
              "price": {
                "value": "string",
                "currency": "string"
              },
              "barcode": "string"
            },
            "returnReason": {
              "id": "123e4567-e89b-12d3-a456-426614174000",
              "key": "return_reasons.doesnt_look_good",
              "details": {
                "visible": false
              },
              "description": "string",
              "default": false
            }
          }
        ],
        "shipments": [
          {
            "id": "123e4567-e89b-12d3-a456-426614174000",
            "returnOrderId": "123e4567-e89b-12d3-a456-426614174000",
            "shippingProductId": "123e4567-e89b-12d3-a456-426614174000",
            "shippingOptionId": "123e4567-e89b-12d3-a456-426614174000",
            "status": "New",
            "reason": "CreatedByConsumer",
            "receiver": {
              "id": "123e4567-e89b-12d3-a456-426614174000",
              "name": "string",
              "companyName": "string",
              "attention": "string",
              "contactName": "string",
              "phoneNumber": "string",
              "address": {
                "street": "string",
                "houseNumber": "string",
                "suffix": "string",
                "city": "string",
                "postalCode": "string",
                "countryCode": "AF",
                "stateProvinceCode": "string"
              }
            },
            "sender": {
              "firstName": "string",
              "lastName": "string",
              "street": "string",
              "houseNumber": "string",
              "city": "string",
              "postalCode": "string",
              "countryCode": "string"
            },
            "labelUrl": "string",
            "labelBarcode": "string",
            "trackingUrl": "string",
            "trackingNumber": "string",
            "trackingUpdates": [
              {
                "status": "New",
                "explanation": "string",
                "happenedAt": "0020-02-29T00:00Z",
                "createdAt": "0020-02-29T00:00Z"
              }
            ],
            "errorCode": "string",
            "errorMessage": "string",
            "createdAt": "0020-02-29T00:00Z",
            "updatedAt": "0020-02-29T00:00Z",
            "shippingProduct": {
              "id": "123e4567-e89b-12d3-a456-426614174000",
              "name": "string",
              "productCode": "string",
              "logoUrl": "string",
              "shippingMethod": "CARRIER_INTEGRATION",
              "labelType": "REQUIRED",
              "key": "string"
            }
          }
        ],
        "relatedSalesOrdersTags": [
          {
            "salesOrderId": "123e4567-e89b-12d3-a456-426614174000",
            "tags": [
              "string"
            ]
          }
        ],
        "appliedReturnRules": [
          {
            "id": "123e4567-e89b-12d3-a456-426614174000",
            "actionType": "RETURN_PERIOD",
            "actionArgument": 0,
            "conditions": [
              "string"
            ],
            "description": "string",
            "tags": [
              "StoreCredit"
            ]
          }
        ]
      }
    ],
    "relatedResolutionTransactions": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "accountId": "123e4567-e89b-12d3-a456-426614174000",
        "createdAt": "0020-02-29",
        "updatedAt": "0020-02-29",
        "resolutionType": "Refund",
        "processedReturnRequestIds": [
          "123e4567-e89b-12d3-a456-426614174000"
        ],
        "returnRequestIds": [
          "123e4567-e89b-12d3-a456-426614174000"
        ],
        "status": "New",
        "includingShippingCost": false,
        "exchangeOrderNumber": "string",
        "errors": [
          {
            "errorCode": "TRANSACTION_ALREADY_EXISTS",
            "errorMessage": "string"
          }
        ],
        "restockData": {
          "property1": {
            "restockLocationId": "string",
            "errors": [
              {
                "errorCode": "RESTOCK_FAILED_ON_ECOMM_SYSTEM",
                "errorMessage": "string"
              }
            ]
          },
          "property2": {
            "restockLocationId": "string",
            "errors": [
              {
                "errorCode": "RESTOCK_FAILED_ON_ECOMM_SYSTEM",
                "errorMessage": "string"
              }
            ]
          }
        },
        "incentiveAmount": {
          "value": "string",
          "currency": "string"
        },
        "processedBy": {
          "id": "123e4567-e89b-12d3-a456-426614174000",
          "type": "user",
          "name": "John Doe",
          "email": "john.doe@example.com"
        }
      }
    ],
    "shipping": {
      "cost": {
        "value": "string",
        "currency": "string"
      },
      "hasBeenRefunded": false
    },
    "suggestRefundShippingCost": false,
    "storeName": "string",
    "storeSlug": "string",
    "financialStatus": "string",
    "paymentMethods": [
      "string"
    ],
    "totalUnitCount": 0,
    "restockLocations": [
      {
        "name": "string",
        "id": "string",
        "address": "string",
        "productIds": [
          "string"
        ]
      }
    ],
    "tags": [
      "string"
    ],
    "createdAt": "0020-02-29T00:00Z",
    "updatedAt": "0020-02-29T00:00Z"
  }
}