export default {
  "id": "67dd47dfbc632c1804db1bf1",
  "name": "kustomer.customer.update",
  "org": "67dd47dfbc632c1804db1bf1",
  "partition": "67dd47dfbc632c1804db1bf1",
  "data": {
    "type": "customer",
    "id": "67dd47dfbc632c1804db1bf1",
    "attributes": {
      "name": "Updated Name",
      "displayName": "Updated Name",
      "displayColor": "pink",
      "displayIcon": "stereo",
      "externalId": "123",
      "externalIds": [
        {
          "externalId": "123",
          "verified": true,
          "externalVerified": false
        }
      ],
      "sharedExternalIds": [
        {
          "externalId": "123",
          "verified": false,
          "externalVerified": false
        }
      ],
      "avatarUrl": "https://avatarUrl.com",
      "username": "username",
      "emails": [
        {
          "type": "home",
          "email": "email@email.com",
          "verified": false,
          "externalVerified": false
        }
      ],
      "sharedEmails": [
        {
          "type": "home",
          "email": "email@email.com",
          "verified": false,
          "externalVerified": false
        }
      ],
      "phones": [
        {
          "type": "mobile",
          "phone": "+1234567890",
          "verified": false
        }
      ],
      "sharedPhones": [
        {
          "type": "mobile",
          "phone": "+1234567890",
          "verified": false
        }
      ],
      "whatsapps": [
        {
          "type": "mobile",
          "phone": "whatsapp:+1234567890",
          "verified": false
        }
      ],
      "sharedWhatsapps": [],
      "facebookIds": [],
      "instagramIds": [],
      "socials": [],
      "sharedSocials": [],
      "urls": [
        {
          "type": "website",
          "url": "https://url.com"
        }
      ],
      "locations": [],
      "activeUsers": [],
      "watchers": [],
      "recentLocation": {
        "updatedAt": "2025-03-21T19:25:27.886Z"
      },
      "locale": null,
      "birthdayAt": "2001-12-12T12:12:12.000Z",
      "gender": "f",
      "createdAt": "2025-03-21T19:25:27.882Z",
      "updatedAt": "2025-03-21T20:23:52.827Z",
      "modifiedAt": "2025-03-21T20:23:52.827Z",
      "lastActivityAt": "2025-03-21T20:23:52.826Z",
      "deleted": false,
      "lastConversation": {
        "channels": [],
        "tags": []
      },
      "conversationCounts": {
        "done": 0,
        "open": 0,
        "snoozed": 0,
        "all": 0
      },
      "preview": {},
      "tags": [
        "67dd47dfbc632c1804db1bf1",
        "67dd47dfbc632c1804db1bf1",
        "67dd47dfbc632c1804db1bf1"
      ],
      "sentiment": {
        "polarity": -1,
        "confidence": -1
      },
      "progressiveStatus": null,
      "verified": true,
      "rev": 7,
      "recentItems": [],
      "defaultLang": "af",
      "satisfactionLevel": {
        "firstSatisfaction": {
          "sentByTeams": []
        },
        "lastSatisfaction": {
          "sentByTeams": []
        }
      },
      "roleGroupVersions": [],
      "accessOverride": [],
      "companyName": "company name",
      "firstName": "company",
      "lastName": "name"
    },
    "relationships": {
      "messages": {
        "links": {
          "self": "/v1/customers/67dd47dfbc632c1804db1bf1/messages"
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
        "data": {
          "type": "org",
          "id": "67dd47dfbc632c1804db1bf1"
        },
        "links": {
          "self": "/v1/orgs/67dd47dfbc632c1804db1bf1"
        }
      },
      "company": {
        "links": {
          "self": "/v1/companies/67dd47dfbc632c1804db1bf1"
        },
        "data": {
          "type": "company",
          "id": "67dd47dfbc632c1804db1bf1"
        }
      }
    },
    "links": {
      "self": "/v1/customers/67dd47dfbc632c1804db1bf1"
    }
  },
  "createdAt": "2025-03-21T20:23:52.847Z",
  "changes": {
    "attributes": {
      "name": {
        "op": "replace",
        "before": "Name",
        "after": "Updated Name"
      },
      "displayName": {
        "op": "replace",
        "before": "Name",
        "after": "Updated Name"
      },
      "updatedAt": {
        "op": "replace",
        "before": "2025-03-21T19:32:42.243Z",
        "after": "2025-03-21T20:23:52.827Z"
      },
      "modifiedAt": {
        "op": "replace",
        "before": "2025-03-21T19:32:42.243Z",
        "after": "2025-03-21T20:23:52.827Z"
      },
      "lastActivityAt": {
        "op": "replace",
        "before": "2025-03-21T19:32:42.242Z",
        "after": "2025-03-21T20:23:52.826Z"
      },
      "rev": {
        "op": "replace",
        "before": 6,
        "after": 7
      },
    },
    "relationships": {}
  },
  "persist": true,
  "client": "api-gw",
  "dataId": "67dd47dfbc632c1804db1bf1",
  "meta": {
    "customChanged": false
  },
  "snsFilters": []
}