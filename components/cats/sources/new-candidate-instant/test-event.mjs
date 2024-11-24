export default {
  "event": "candidate.created",
  "candidate_id": 123456789,
  "date": "2024-11-19T20:13:12+00:00",
  "_links": {
    "candidate": {
      "href": "/candidates/123456789"
    }
  },
  "_embedded": {
    "candidate": {
      "id": 123456789,
      "first_name": "Candidate Name",
      "middle_name": "Middle Name",
      "last_name": "Last Name",
      "title": "Candidate Tittle",
      "emails": {
        "primary": "candidate@email.com",
        "secondary": null
      },
      "address": {
        "street": "street",
        "city": "city",
        "state": "CA",
        "postal_code": "18234"
      },
      "country_code": "US",
      "social_media_urls": [],
      "website": "https://website.com",
      "phones": {
        "home": null,
        "cell": "1234567890",
        "work": null
      },
      "best_time_to_call": "14:00",
      "current_employer": "CurrentEmployer",
      "date_available": "2024-12-12",
      "current_pay": "400",
      "desired_pay": "8000",
      "is_willing_to_relocate": true,
      "key_skills": "",
      "notes": "",
      "is_hot": true,
      "is_active": true,
      "contact_id": null,
      "owner_id": 123456,
      "entered_by_id": 123456,
      "source": "",
      "is_registered": true,
      "consent_status": null,
      "date_created": "2024-11-19T20:13:12+00:00",
      "date_modified": "2024-11-19T20:13:12+00:00",
      "_links": {
        "self": {
          "href": "/candidates/123456789"
        },
        "custom_fields": {
          "href": "/candidates/123456789/custom_fields"
        },
        "attachments": {
          "href": "/candidates/123456789/attachments"
        },
        "activities": {
          "href": "/candidates/123456789/activities"
        },
        "work_history": {
          "href": "/candidates/123456789/work_history"
        },
        "pipelines": {
          "href": "/candidates/123456789/pipelines"
        },
        "tags": {
          "href": "/candidates/123456789/tags"
        },
        "thumbnail": {
          "href": "/candidates/123456789/thumbnail"
        },
        "phones": {
          "href": "/candidates/123456789/phones"
        },
        "emails": {
          "href": "/candidates/123456789/emails"
        },
        "owner": {
          "href": "/users/123456"
        },
        "entered_by": {
          "href": "/users/123456"
        }
      },
      "_embedded": {
        "custom_fields": [],
        "work_history": [],
        "thumbnail": [
          {
            "id": 92680,
            "source": "gravatar",
            "attachment_id": null,
            "url": "https://pipedream.catsone.com/candidates/123456789/thumbnail?_s=e1221ae117fecea3c20ec9075dfb36ac05e876d1be10725e27b4eeb42289bd65",
            "_links": {
              "self": {
                "href": "/candidates/123456789/thumbnail"
              }
            }
          }
        ],
        "phones": [],
        "emails": []
      }
    }
  }
}