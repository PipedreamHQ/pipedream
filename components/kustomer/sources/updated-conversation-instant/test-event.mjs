export default {
  "id": "67dd47dfbc632c1804db1bf1",
  "name": "kustomer.conversation.update",
  "org": "67dd47dfbc632c1804db1bf1",
  "partition": "67dd47dfbc632c1804db1bf1",
  "orgName": "par-pipedream-berta",
  "data": {
    "type": "conversation",
    "id": "67dd47dfbc632c1804db1bf1",
    "attributes": {
      "externalId": "123",
      "name": "Updated Name",
      "channels": [],
      "status": "open",
      "open": {
        "statusAt": "2025-03-20T18:50:55.976Z"
      },
      "messageCount": 0,
      "noteCount": 0,
      "satisfaction": 0,
      "satisfactionLevel": {
        "sentByTeams": [],
        "answers": []
      },
      "createdAt": "2025-03-20T18:50:55.976Z",
      "updatedAt": "2025-03-21T20:20:11.424Z",
      "modifiedAt": "2025-03-21T20:20:11.424Z",
      "lastActivityAt": "2025-03-20T18:50:55.981Z",
      "spam": false,
      "ended": false,
      "tags": [
        "67dd47dfbc632c1804db1bf1",
        "67dd47dfbc632c1804db1bf1",
        "67dd47dfbc632c1804db1bf1"
      ],
      "suggestedTags": [],
      "predictions": [],
      "suggestedShortcuts": [],
      "firstMessageIn": {},
      "firstMessageOut": {
        "createdByTeams": []
      },
      "lastMessageIn": {},
      "lastMessageOut": {},
      "lastMessageUnrespondedTo": {},
      "lastMessageUnrespondedToSinceLastDone": {},
      "assignedUsers": [
        "67dd47dfbc632c1804db1bf1",
        "67dd47dfbc632c1804db1bf1"
      ],
      "assignedTeams": [
        "67dd47dfbc632c1804db1bf1",
        "67dd47dfbc632c1804db1bf1",
        "67dd47dfbc632c1804db1bf1"
      ],
      "firstResponse": {
        "createdByTeams": [],
        "assignedTeams": [],
        "assignedUsers": []
      },
      "firstResponseSinceLastDone": {
        "createdByTeams": [],
        "assignedTeams": [],
        "assignedUsers": []
      },
      "lastResponse": {
        "createdByTeams": [],
        "assignedTeams": [],
        "assignedUsers": []
      },
      "firstDone": {
        "createdByTeams": [],
        "assignedTeams": [],
        "assignedUsers": []
      },
      "lastDone": {
        "createdByTeams": [],
        "assignedTeams": [],
        "assignedUsers": []
      },
      "direction": "in",
      "outboundMessageCount": 0,
      "inboundMessageCount": 0,
      "rev": 3,
      "priority": 5,
      "defaultLang": "en_us",
      "locale": "US",
      "roleGroupVersions": [],
      "accessOverride": [],
      "modificationHistory": {
        "nameAt": "2025-03-21T20:20:11.426Z",
        "priorityAt": "2025-03-20T18:50:55.976Z",
        "channelAt": "2025-03-20T18:50:55.976Z",
        "assignedTeamsAt": "2025-03-20T18:50:55.976Z",
        "assignedUsersAt": "2025-03-20T18:50:55.976Z",
        "brandAt": null,
        "defaultLangAt": null,
        "statusAt": "2025-03-20T18:50:55.976Z",
        "tagsAt": "2025-03-20T18:50:55.976Z",
        "customAt": null
      },
      "billingStatus": "no_messages",
      "assistant": {
        "fac": {
          "reasons": [],
          "exclusions": [],
          "source": {}
        },
        "assistantId": []
      },
      "aiAgent": {
        "automationId": []
      },
      "phase": "initial",
      "matchedTimeBasedRules": []
    },
    "relationships": {
      "messages": {
        "links": {
          "self": "/v1/conversations/67dd47dfbc632c1804db1bf1/messages"
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
      "org": {
        "links": {
          "self": "/v1/orgs/67dd47dfbc632c1804db1bf1"
        },
        "data": {
          "type": "org",
          "id": "67dd47dfbc632c1804db1bf1"
        }
      },
      "customer": {
        "data": {
          "type": "customer",
          "id": "67dd47dfbc632c1804db1bf1"
        },
        "links": {
          "self": "/v1/customers/67dd47dfbc632c1804db1bf1"
        }
      },
      "queue": {
        "data": {
          "type": "queue",
          "id": "67dd47dfbc632c1804db1bf1"
        },
        "links": {
          "self": "/v1/routing/queues/67dd47dfbc632c1804db1bf1"
        }
      },
      "brand": {
        "data": {
          "type": "brand",
          "id": "67dd47dfbc632c1804db1bf1"
        },
        "links": {
          "self": "/v1/brands/67dd47dfbc632c1804db1bf1"
        }
      }
    },
    "links": {
      "self": "/v1/conversations/67dd47dfbc632c1804db1bf1"
    }
  },
  "createdAt": "2025-03-21T20:20:11.435Z",
  "changes": {
    "attributes": {
      "externalId": {
        "op": "replace",
        "before": "123",
        "after": "321"
      },
      "name": {
        "op": "replace",
        "before": "Name",
        "after": "Update Name"
      },
      "updatedAt": {
        "op": "replace",
        "before": "2025-03-21T19:54:02.663Z",
        "after": "2025-03-21T20:20:11.424Z"
      },
      "modifiedAt": {
        "op": "replace",
        "before": "2025-03-21T19:54:02.663Z",
        "after": "2025-03-21T20:20:11.424Z"
      },
      "rev": {
        "op": "replace",
        "before": 2,
        "after": 3
      },
      "modificationHistory": {
        "op": "replace",
        "before": {
          "nameAt": "2025-03-21T19:54:02.664Z",
          "priorityAt": "2025-03-20T18:50:55.976Z",
          "channelAt": "2025-03-20T18:50:55.976Z",
          "assignedTeamsAt": "2025-03-20T18:50:55.976Z",
          "assignedUsersAt": "2025-03-20T18:50:55.976Z",
          "brandAt": null,
          "defaultLangAt": null,
          "statusAt": "2025-03-20T18:50:55.976Z",
          "tagsAt": "2025-03-20T18:50:55.976Z",
          "customAt": null
        },
        "after": {
          "nameAt": "2025-03-21T20:20:11.426Z",
          "priorityAt": "2025-03-20T18:50:55.976Z",
          "channelAt": "2025-03-20T18:50:55.976Z",
          "assignedTeamsAt": "2025-03-20T18:50:55.976Z",
          "assignedUsersAt": "2025-03-20T18:50:55.976Z",
          "brandAt": null,
          "defaultLangAt": null,
          "statusAt": "2025-03-20T18:50:55.976Z",
          "tagsAt": "2025-03-20T18:50:55.976Z",
          "customAt": null
        }
      }
    },
    "relationships": {}
  },
  "persist": true,
  "client": "api-gw",
  "dataId": "67dd47dfbc632c1804db1bf1",
  "meta": {
    "customChanged": false
  },
  "snsFilters": [
    "assistant",
    "csat"
  ]
}