export default {
  "event": "contact.created",
  "contact_id": 123456789,
  "date": "2024-11-19T20:21:10+00:00",
  "_links": {
    "contact": {
      "href": "/contacts/123456789"
    }
  },
  "_embedded": {
    "contact": {
      "id": "123456789",
      "first_name": "Contact Name",
      "last_name": "Last Name",
      "title": "Contact title",
      "reports_to_id": 1234567,
      "owner_id": 123456,
      "company_id": 22978541,
      "emails": {
        "primary": "contact@email.com",
        "secondary": null
      },
      "phones": {
        "work": null,
        "cell": "12345678",
        "other": null
      },
      "address": {
        "street": "street",
        "city": "city",
        "state": "CA",
        "postal_code": "92132"
      },
      "country_code": "US",
      "social_media_urls": [],
      "is_hot": false,
      "has_left_company": false,
      "notes": "",
      "entered_by_id": 123456,
      "consent_status": null,
      "date_created": "2024-11-19T20:21:10+00:00",
      "date_modified": "2024-11-19T20:21:10+00:00",
      "status_id": 123456,
      "_links": {
        "self": {
          "href": "/contacts/123456789"
        },
        "reports_to": {
          "href": "/users/1234567"
        },
        "custom_fields": {
          "href": "/contacts/123456789/custom_fields"
        },
        "activities": {
          "href": "/contacts/123456789/activities"
        },
        "status": {
          "href": "/contacts/statuses/123456"
        },
        "entered_by": {
          "href": "/users/123456"
        },
        "owner": {
          "href": "/users/123456"
        },
        "attachments": {
          "href": "/contacts/123456789/attachments"
        },
        "tags": {
          "href": "/contacts/123456789/tags"
        },
        "thumbnail": {
          "href": "/contacts/123456789/thumbnail"
        },
        "phones": {
          "href": "/contacts/123456789/phones"
        },
        "emails": {
          "href": "/contacts/123456789/emails"
        }
      },
      "_embedded": {
        "custom_fields": [],
        "status": {
          "id": 123456,
          "workflow_id": 5696671,
          "title": "No Status",
          "mapping": "",
          "prerequisites": [],
          "triggers": [],
          "_links": {
            "self": {
              "href": "contacts/statuses/123456"
            }
          }
        },
        "thumbnail": [],
        "phones": [],
        "emails": []
      }
    }
  }
}