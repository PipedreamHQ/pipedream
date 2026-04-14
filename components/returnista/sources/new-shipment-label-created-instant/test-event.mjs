export default {
  "event": "shipment.label_created",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "storeId": "123e4567-e89b-12d3-a456-426614174000",
    "accountId": "123e4567-e89b-12d3-a456-426614174000",
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
}
