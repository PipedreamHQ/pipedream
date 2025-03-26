export default {
  "id": "67dd47dfbc632c1804db1bf1",
  "name": "kustomer.message.create",
  "org": "67dd47dfbc632c1804db1bf1",
  "partition": "67dd47dfbc632c1804db1bf1",
  "data": {
    "type": "message",
    "id": "67dd47dfbc632c1804db1bf1",
    "attributes": {
      "channel": "email",
      "app": "postmark",
      "size": 0,
      "direction": "out",
      "directionType": "initial-out",
      "preview": "message...",
      "meta": {
        "from": "support@subdomain.mail.kustomerapp.com",
        "to": [
          {
            "email": "moishe@example.com"
          }
        ]
      },
      "status": "error",
      "assignedTeams": [
        "67dd47dfbc632c1804db1bf1",
        "67dd47dfbc632c1804db1bf1",
        "67dd47dfbc632c1804db1bf1"
      ],
      "assignedUsers": [
        "67dd47dfbc632c1804db1bf1",
        "67dd47dfbc632c1804db1bf1"
      ],
      "error": {
        "status": 400,
        "code": "invalid-recipient",
        "title": "You tried to send to recipient(s) that have been marked as inactive. Found inactive addresses: . Inactive recipients are ones that have generated a hard bounce, a spam complaint, or a manual suppression.",
        "meta": {
          "appErrorCode": 406
        }
      },
      "errorAt": "2025-03-21T20:13:07.702Z",
      "auto": false,
      "sentAt": "2025-03-21T20:13:07.702Z",
      "createdAt": "2025-03-21T20:13:07.798Z",
      "updatedAt": "2025-03-21T20:13:07.798Z",
      "modifiedAt": "2025-03-21T20:13:07.798Z",
      "redacted": false,
      "createdByTeams": [],
      "rev": 1,
      "reactions": [],
      "intentDetections": []
    },
    "relationships": {
      "org": {
        "links": {
          "self": "/v1/orgs/67dd47dfbc632c1804db1bf1"
        },
        "data": {
          "type": "org",
          "id": "67dd47dfbc632c1804db1bf1"
        }
      },
      "createdBy": {
        "links": {
          "self": "/v1/users/67dd47dfbc632c1804db1bf1"
        },
        "data": {
          "type": "user",
          "id": "67dd47dfbc632c1804db1bf1"
        }
      },
      "modifiedBy": {
        "links": {
          "self": "/v1/users/67dd47dfbc632c1804db1bf1"
        },
        "data": {
          "type": "user",
          "id": "67dd47dfbc632c1804db1bf1"
        }
      },
      "customer": {
        "links": {
          "self": "/v1/customers/67dd47dfbc632c1804db1bf1"
        },
        "data": {
          "type": "customers",
          "id": "67dd47dfbc632c1804db1bf1"
        }
      },
      "conversation": {
        "links": {
          "self": "/v1/conversations/67dd47dfbc632c1804db1bf1"
        },
        "data": {
          "type": "conversation",
          "id": "67dd47dfbc632c1804db1bf1"
        }
      }
    },
    "links": {
      "self": "/v1/messages/67dd47dfbc632c1804db1bf1"
    }
  },
  "createdAt": "2025-03-21T20:13:07.814Z",
  "persist": true,
  "client": "postmark-drafts-sender",
  "dataId": "67dd47dfbc632c1804db1bf1",
  "meta": {
    "customChanged": false
  },
  "snsFilters": [
    "assistant"
  ]
}