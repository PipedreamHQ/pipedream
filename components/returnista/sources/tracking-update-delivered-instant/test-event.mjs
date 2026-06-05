export default {
  "event": "shipment.received_tracking_updates.delivered",
  "data": {
    "id": "123e4567-12d3-a456-426614174000",
    "returnOrderId": "123e4567-12d3-a456-426614174001",
    "shippingOptionId": "123e4567-12d3-a456-426614174002",
    "shippingProductId": "123e4567-12d3-a456-426614174003",
    "status": "Delivered",
    "reason": "CreatedByConsumer",
    "receiver": {
      "id": "123e4567-12d3-a456-426614174004",
      "name": "Example Warehouse",
      "companyName": "Example Logistics",
      "attention": "Returns Department",
      "contactName": "",
      "address": {
        "city": "Amsterdam",
        "countryCode": "NL",
        "houseNumber": "1",
        "postalCode": "1012 AB",
        "stateProvinceCode": "",
        "street": "Voorbeeldstraat",
        "suffix": ""
      }
    },
    "sender": {
      "city": "Utrecht",
      "countryCode": "NL",
      "houseNumber": "2",
      "postalCode": "3511 AB",
      "street": "Voorbeeldlaan"
    },
    "labelBarcode": "01012AB00000000000000000000",
    "labelUrl": "https://assets.returnista-integrations.com/labels/123e4567-12d3-a456-426614174005.pdf",
    "trackingUrl": "https://www.dpdgroup.com/nl/mydpd/my-parcels/sending?parcelNumber=00000000000000",
    "trackingNumber": "00000000000000",
    "createdAt": "2026-06-04T07:48:14.686Z",
    "updatedAt": "2026-06-05T09:03:36.907Z",
    "trackingUpdates": [
      {
        "createdAt": "2026-06-04T07:48:14.686Z",
        "explanation": "Shipment created",
        "happenedAt": "2026-06-04T07:48:14.686Z",
        "status": "New"
      },
      {
        "createdAt": "2026-06-04T20:13:24.139Z",
        "explanation": "dpd_has_received_your_parcel",
        "happenedAt": "2026-06-04T12:46:30.000Z",
        "status": "Collected"
      },
      {
        "createdAt": "2026-06-04T20:13:24.139Z",
        "explanation": "the_parcel_is_at_the_parcel_dispatch_centre",
        "happenedAt": "2026-06-04T14:38:26.000Z",
        "status": "Transit"
      },
      {
        "createdAt": "2026-06-05T02:38:31.142Z",
        "explanation": "at_parcel_delivery_centre",
        "happenedAt": "2026-06-05T02:32:32.000Z",
        "status": "In_depot"
      },
      {
        "createdAt": "2026-06-05T09:03:36.906Z",
        "explanation": "the_parcel_has_left_the_parcel_delivery_centre_and_is_on_its_way_to_the_consignee",
        "happenedAt": "2026-06-05T07:42:48.000Z",
        "status": "Out_delivery"
      },
      {
        "createdAt": "2026-06-05T09:03:36.906Z",
        "explanation": "your_parcel_has_been_delivered_successfully",
        "happenedAt": "2026-06-05T08:45:30.000Z",
        "status": "Delivered"
      }
    ],
    "shippingProduct": {
      "id": "123e4567-12d3-a456-426614174003",
      "name": "DPD",
      "logoUrl": "https://storage-repay.fra1.digitaloceanspaces.com/courier_service_logos/dpd.svg",
      "shippingMethod": "CARRIER_INTEGRATION",
      "labelType": "REQUIRED",
      "key": "dpd"
    },
    "storeId": "123e4567-12d3-a456-426614174006",
    "accountId": "123e4567-12d3-a456-426614174007"
  }
};
