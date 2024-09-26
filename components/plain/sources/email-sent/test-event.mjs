export default {
  "timestamp": "2023-10-19T21:44:01.325Z",
  "workspaceId": "w_01FXQ6A83FXNN9XA00415VR1XP",
  "payload": {
    "eventType": "thread.email_sent",
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
        "updatedAt": "2023-10-19T21:26:06.658Z",
        "updatedBy": {
          "actorType": "user",
          "userId": "u_01H1V4NA10RMHWFBXB6A1ZBYRA"
        }
      },
      "title": "Unable to tail logs",
      "previewText": "Hey, I am currently unable to tail the logs of the service svc-8af1e3",
      "priority": 1,
      "externalId": null,
      "status": "DONE",
      "statusChangedAt": "2023-10-19T21:24:36.108Z",
      "statusChangedBy": {
        "actorType": "user",
        "userId": "u_01H1V4NA10RMHWFBXB6A1ZBYRA"
      },
      "statusDetail": null,
      "assignee": null,
      "assignedAt": null,
      "labels": [],
      "firstInboundMessageInfo": {
        "timestamp": "2023-10-19T14:12:25.733Z",
        "messageSource": "EMAIL"
      },
      "firstOutboundMessageInfo": null,
      "lastInboundMessageInfo": {
        "timestamp": "2023-10-19T14:12:25.733Z",
        "messageSource": "EMAIL"
      },
      "lastOutboundMessageInfo": null,
      "supportEmailAddresses": ["help@example.com"],
      "createdAt": "2023-10-19T14:12:25.266Z",
      "createdBy": {
        "actorType": "system",
        "system": "email_inbound_handler"
      },
      "updatedAt": "2023-10-19T21:38:54.335Z",
      "updatedBy": {
        "actorType": "user",
        "userId": "u_01H1V4NA10RMHWFBXB6A1ZBYRA"
      }
    },
    "email": {
      "timelineEntryId": "t_01HD4YABRC74XY3D4SKAWKHXMH",
      "id": "em_01HD4YABKW46E4Y8384T6ARDA5",
      "to": {
        "email": "peter@example.com",
        "name": "Peter Santos",
        "emailActor": {
          "actorType": "customer",
          "customerId": "c_01HD44FHDPG82VQ4QNHDR4N2T0"
        }
      },
      "from": {
        "email": "help@example.com",
        "name": "Sam at Resolve",
        "emailActor": {
          "actorType": "supportEmailAddress",
          "supportEmailAddress": "help@example.com"
        }
      },
      "additionalRecipients": [],
      "hiddenRecipients": [],
      "subject": "Re: Test",
      "textContent": "Hey",
      "markdownContent": "Hey",
      "authenticity": "PASS",
      "sentAt": "2023-10-19T21:44:00.865Z",
      "receivedAt": null,
      "attachments": [],
      "inReplyToEmailId": "em_01HD44FF33QTSGW5JN37BFY6YE",
      "createdAt": "2023-10-19T21:43:58.967Z",
      "createdBy": {
        "actorType": "user",
        "userId": "u_01H1V4NA10RMHWFBXB6A1ZBYRA"
      },
      "updatedAt": "2023-10-19T21:44:01.201Z",
      "updatedBy": {
        "actorType": "system",
        "system": "email_sender"
      }
    }
  },
  "id": "pEv_01HD4YAEHDHS2FW3F3VRSEGGVF",
  "webhookMetadata": {
    "webhookTargetId": "whTarget_01HD4400VTDJQ646V6RY37SR7K",
    "webhookDeliveryAttemptId": "whAttempt_01HD4YAFB6VN6AJ4TGVY4DJ0VR",
    "webhookDeliveryAttemptNumber": 1,
    "webhookDeliveryAttemptTimestamp": "2023-10-19T21:44:02.150Z"
  },
  "type": "thread.email_sent"
}
