export default {
  "timestamp": "2023-10-19T14:21:43.616Z",
  "workspaceId": "w_01GST0W989ZNAW53X6XYHAY87P",
  "payload": {
    "eventType": "customer.customer_updated",
    "customer": {
      "id": "c_01HD44FHDPG82VQ4QNHDR4N2T0",
      "email": {
        "email": "peter@example.com",
        "isVerified": false,
        "verifiedAt": null
      },
      "externalId": null,
      "fullName": "Peter Santos",
      "shortName": "Peter",
      "markedAsSpamAt": "2023-10-19T14:21:43.616Z",
      "markedAsSpamBy": {
        "actorType": "user",
        "userId": "u_01H1V4NA10RMHWFBXB6A1ZBYRA"
      },
      "customerGroupMemberships": [],
      "createdAt": "2023-10-19T14:12:25.142Z",
      "createdBy": {
        "actorType": "system",
        "system": "email_inbound_handler"
      },
      "updatedAt": "2023-10-19T14:21:43.616Z",
      "updatedBy": {
        "actorType": "user",
        "userId": "u_01H1V4NA10RMHWFBXB6A1ZBYRA"
      }
    },
    "previousCustomer": {
      "id": "c_01HD44FHDPG82VQ4QNHDR4N2T0",
      "email": {
        "email": "peter@example.com",
        "isVerified": false,
        "verifiedAt": null
      },
      "externalId": null,
      "fullName": "Peter Santos",
      "shortName": "Peter",
      "markedAsSpamAt": null,
      "markedAsSpamBy": null,
      "customerGroupMemberships": [],
      "createdAt": "2023-10-04T14:17:41.991Z",
      "createdBy": {
        "actorType": "system",
        "system": "email_inbound_handler"
      },
      "updatedAt": "2023-10-04T14:17:41.991Z",
      "updatedBy": {
        "actorType": "system",
        "system": "email_inbound_handler"
      }
    }
  },
  "id": "pEv_01HD450JT0RPBT7RRKS1ZQJYBA",
  "webhookMetadata": {
    "webhookTargetId": "whTarget_01HD4400VTDJQ646V6RY37SR7K",
    "webhookDeliveryAttemptId": "whAttempt_01HD450N6X782MDTDBMS6Z14DJ",
    "webhookDeliveryAttemptNumber": 1,
    "webhookDeliveryAttemptTimestamp": "2023-10-19T14:21:46.077Z"
  },
  "type": "customer.customer_updated"
}
