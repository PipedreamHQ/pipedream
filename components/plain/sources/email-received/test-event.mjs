export default {
  "timestamp": "2023-10-19T14:12:25.733Z",
  "workspaceId": "w_01FXQ6A83FXNN9XA00415VR1XP",
  "payload": {
    "eventType": "thread.email_received",
    "thread": {
      "id": "th_01HD44FHMCDSSWE38N14FSYV6K",
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
        "markedAsSpamAt": null,
        "markedAsSpamBy": null,
        "customerGroupMemberships": [],
        "createdAt": "2023-10-19T14:12:25.142Z",
        "createdBy": {
          "actorType": "system",
          "system": "email_inbound_handler"
        },
        "updatedAt": "2023-10-19T14:12:25.142Z",
        "updatedBy": {
          "actorType": "system",
          "system": "email_inbound_handler"
        }
      },
      "title": "Unable to tail logs",
      "previewText": "Hey, I am currently unable to tail the logs of the service svc-8af1e3",
      "priority": 2,
      "externalId": null,
      "status": "TODO",
      "statusChangedAt": "2023-10-19T14:12:25.266Z",
      "statusChangedBy": {
        "actorType": "system",
        "system": "email_inbound_handler"
      },
      "statusDetail": {
        "type": "CREATED",
        "createdAt": "2023-10-19T14:12:25.266Z"
      },
      "assignee": null,
      "assignedAt": null,
      "labels": [],
      "firstInboundMessageInfo": null,
      "firstOutboundMessageInfo": null,
      "lastInboundMessageInfo": null,
      "lastOutboundMessageInfo": null,
      "supportEmailAddresses": [],
      "createdAt": "2023-10-19T14:12:25.266Z",
      "createdBy": {
        "actorType": "system",
        "system": "email_inbound_handler"
      },
      "updatedAt": "2023-10-19T14:12:25.266Z",
      "updatedBy": {
        "actorType": "system",
        "system": "email_inbound_handler"
      }
    },
    "email": {
      "timelineEntryId": "t_01HD44FHHJ4DJC452ZTAR73PPF",
      "id": "em_01HD44FF33QTSGW5JN37BFY6YE",
      "to": {
        "email": "help@example.com",
        "name": null,
        "emailActor": {
          "actorType": "supportEmailAddress",
          "supportEmailAddress": "help@example.com"
        }
      },
      "from": {
        "email": "peter@example.com",
        "name": "Peter Santos",
        "emailActor": {
          "actorType": "customer",
          "customerId": "c_01HD44FHDPG82VQ4QNHDR4N2T0"
        }
      },
      "additionalRecipients": [],
      "hiddenRecipients": [],
      "subject": "Unable to tail logs",
      "textContent": "Hey, I am currently unable to tail the logs of the service svc-8af1e3",
      "markdownContent": "Hey, I am currently unable to tail the logs of the service svc-8af1e3",
      "authenticity": "PASS",
      "sentAt": null,
      "receivedAt": "2023-10-19T14:12:22.757Z",
      "attachments": [],
      "inReplyToEmailId": null,
      "createdAt": "2023-10-19T14:12:25.733Z",
      "createdBy": {
        "actorType": "customer",
        "customerId": "c_01HD44FHDPG82VQ4QNHDR4N2T0"
      },
      "updatedAt": "2023-10-19T14:12:25.733Z",
      "updatedBy": {
        "actorType": "customer",
        "customerId": "c_01HD44FHDPG82VQ4QNHDR4N2T0"
      }
    }
  },
  "id": "pEv_01HD44FJ053ZHW13SWS9556THX",
  "webhookMetadata": {
    "webhookTargetId": "whTarget_01HD4400VTDJQ646V6RY37SR7K",
    "webhookDeliveryAttemptId": "whAttempt_01HD44SZM21CPW0MXEQ73C2X7C",
    "webhookDeliveryAttemptNumber": 1,
    "webhookDeliveryAttemptTimestamp": "2023-10-19T14:18:07.362Z"
  },
  "type": "thread.email_received"
}
