export default {
  "id": "4b358d12-b0f0-11ec-a886-c2ade99df33d",
  "type": "contacts.created",
  "payload": {
    "format": "v1_full_change_detail",
    "context": {
      "account_id": "2057",
      "service": "Contacts",
      "record_id": 36685959,
      "triggered_by_user": {
        "id": "53487",
      }
    },
    "data": {
      "pre": [],
      "post": {
        "system_record_state": "active",
        "system_ctime": 1694194201,
        "system_modtime": 1694194202,
        "system_search_key": "Test Contact",
        "address": null,
        "address_postal": null,
        "marketing_postcode": null,
        "marketing_enquiry_source": null,
        "marketing_gender": null,
        "marketing_birthday": null,
        "notes": null,
        "company_name": null,
        "company_abn": null,
        "website_url": null,
        "is_dnd": null,
        "type": "person",
        "interest_level": null,
        "last_contacted_date": null,
        "name_legal": null,
        "name_salutation": null,
        "name_addressee": null,
        "last_contacted_at": null,
        "etag": "36685959-1694194202",
        "id": 36685959,
        "system_owner_user": {
          "id": "53487",
        },
        "system_modified_user": {
          "id": "53487",
        },
        "system_created_user": {
          "id": "53487",
        },
        "smart_categories": [],
        "contact_image": null,
        "company_size": null,
        "marketing_enquiry_method": null,
        "related": {
          "contact_emails": [],
          "contact_names": [
            {
              "name_title": null,
              "name_first": "Test",
              "name_middle": null,
              "name_last": "Contact 4",
              "id": 40184941
            }
          ],
          "contact_phones": [],
          "contact_tags": [],
          "contact_documents": [],
          "contact_mailing_lists": [],
          "contact_relationships": [],
          "contact_reln_property": [],
          "contact_reln_listing": []
        },
        "address_wash": null,
        "address_postal_wash": null,
        "security_user_rights": [
          "read",
          "update",
          "archive",
          "trash",
          "perms"
        ],
        "cf.19028": null,
        "cf.Livechat.Chat Details.chat_id": null,
        "cf.19029": null,
        "cf.Livechat.Chat Details.chat_start_url": null,
        "cf.19030": null,
        "cf.Livechat.Chat Details.referrer_url": null,
        "cf.19031": null,
        "cf.Livechat.Chat Details.property_link": null,
        "cf.19032": null,
        "cf.Livechat.Chat Details.area_interested_in": null,
        "cf.19033": null,
        "cf.Livechat.Chat Details.property_address": null,
        "cf.19034": null,
        "cf.Livechat.Chat Details.transcript": null
      },
      "changes": {
        "attributes": {
          "system_record_state": {
            "previous": null,
            "new": "active"
          },
          "type": {
            "previous": null,
            "new": "person"
          },
          "system_owner_user": {
            "previous": null,
            "new": {
              "id": "53487",
            }
          },
          "system_modified_user": {
            "previous": null,
            "new": {
              "id": "53487",
            }
          },
          "system_created_user": {
            "previous": null,
            "new": {
              "id": "53487",
            }
          },
          "security_user_rights": {
            "previous": null,
            "new": [
              "read",
              "update",
              "archive",
              "trash",
              "perms"
            ]
          }
        },
        "related": {
          "contact_names": {
            "create": [
              {
                "id": 40184941,
                "attributes": {
                  "name_first": {
                    "previous": null,
                    "new": "Test"
                  },
                  "name_last": {
                    "previous": null,
                    "new": "Contact"
                  }
                }
              }
            ],
            "update": [],
            "purge": []
          }
        }
      }
    }
  },
  "created_at": "2022-01-01T12:00:00.000+00:00"
}