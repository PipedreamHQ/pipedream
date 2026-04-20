export default {
  "event": "return_order.created",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "storeId": "123e4567-e89b-12d3-a456-426614174000",
    "consumerId": "123e4567-e89b-12d3-a456-426614174000",
    "shippingOptionId": "123e4567-e89b-12d3-a456-426614174000",
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
    "insuranceTotal": {
      "value": "string",
      "currency": "string"
    },
    "shippingOptionQuote": {
      "shippingOptionId": "123e4567-e89b-12d3-a456-426614174000",
      "price": {
        "value": "string",
        "currency": "string"
      },
      "variant": {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "key": "string",
        "name": "string",
        "constraints": {
          "max_weight": "string",
          "max_dimensions": "string"
        },
        "priceModifier": {
          "value": "string",
          "currency": "string"
        },
        "set": "string"
      }
    },
    "shippingOptionTotal": {
      "value": "string",
      "currency": "string"
    },
    "paymentId": "string",
    "createdAt": "0020-02-29T00:00Z",
    "updatedAt": "0020-02-29T00:00Z",
    "relationUpdatedAt": "0020-02-29T00:00Z",
    "tags": [
      "string"
    ],
    "status": "Pending",
    "paymentStatus": "Open",
    "purchaseOrderNumbers": [
      "string"
    ],
    "comments": [
      {
        "name": "string",
        "content": "string",
        "createdAt": "string"
      }
    ],
    "appliedVouchers": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "status": "NEW",
        "applicableTo": [
          "SHIPPING_FEE"
        ]
      }
    ],
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
    "source": "ReturnsPortal",
    "packageCount": 0,
    "createdFromRequest": false,
    "createdWithoutShipment": false,
    "draftReturnOrderId": "123e4567-e89b-12d3-a456-426614174000",
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
        "purchaseId": "19d8c827-0da0-4000-8417-8664c4645180",
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
    "store": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "string",
      "slug": "string",
      "accountId": "123e4567-e89b-12d3-a456-426614174000",
      "uat": false,
      "ecommBridgeIds": [
        "123e4567-e89b-12d3-a456-426614174000"
      ]
    },
    "relatedSalesOrdersTags": [
      {
        "salesOrderId": "123e4567-e89b-12d3-a456-426614174000",
        "tags": [
          "string"
        ]
      }
    ]
  }
}
