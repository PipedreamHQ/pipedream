export default {
  "id": "4b358d12-b0f0-11ec-a886-c2ade99df33d",
  "type": "leads.created",
  "payload": {
    "format": "v1_full_change_detail",
    "context": {
      "account_id": "2057",
      "service": "Leads",
      "record_id": 8812935,
      "triggered_by_user": {
        "id": "53487",
      },
    },
    "data": {
      "pre": [],
      "post": {
        "system_record_state": "active",
        "system_ctime": "1694195404",
        "system_modtime": "1694195404",
        "system_completed_time": null,
        "system_assigned_time": null,
        "is_email_lead": null,
        "body_snippet": "",
        "security_user_rights": [
          "read",
          "update",
          "trash",
        ],
        "contact": {
          "name": "testperson",
          "email_address": "testperson@yopmail.com",
          "phone_number": "(03) 9583 2524",
          "fax_number": null,
          "address_postal": null,
          "address": null,
          "id": "34942042",
        },
        "project": null,
        "project_stage": null,
        "listing": null,
        "property": null,
        "assignee": null,
        "system_completed_by_user": null,
        "system_modified_user": {
          "id": "53487",
        },
        "system_created_user": {
          "id": "53487",
        },
        "system_assigned_by_user": null,
        "lead_type": {
          "id": "general",
          "text": "General",
        },
        "lead_source": {
          "id": "191",
          "text": "Billboard",
        },
        "last_activity": null,
        "lead_status": {
          "id": "new",
          "text": "New",
        },
        "etag": "8812935-1694195404",
        "id": "8812935",
        "note": "",
      },
      "changes": {
        "attributes": {
          "system_record_state": {
            "previous": null,
            "new": "active",
          },
          "body_snippet": {
            "previous": null,
            "new": "bla bla bla",
          },
          "security_user_rights": {
            "previous": null,
            "new": [
              "read",
              "update",
              "trash",
            ],
          },
          "contact": {
            "previous": null,
            "new": {
              "name": "testperson",
              "email_address": "testperson@yopmail.com",
              "phone_number": "(03) 9583 2524",
              "fax_number": null,
              "address_postal": null,
              "address": null,
              "id": "34942042",
            },
          },
          "system_modified_user": {
            "previous": null,
            "new": {
              "id": "53487",
            },
          },
          "system_created_user": {
            "previous": null,
            "new": {
              "id": "53487",
            },
          },
          "lead_type": {
            "previous": null,
            "new": {
              "id": "general",
              "text": "General",
            },
          },
          "lead_source": {
            "previous": null,
            "new": {
              "id": "191",
              "text": "Billboard",
            },
          },
          "lead_status": {
            "previous": null,
            "new": {
              "id": "new",
              "text": "New",
            },
          },
          "note": {
            "previous": null,
            "new": "",
          },
        },
        "related": [],
      },
    },
  },
  "created_at": "2022-01-01T12:00:00.000+00:00",
};
