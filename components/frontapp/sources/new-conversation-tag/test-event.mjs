export default {
  "_links": {
    "self": "string",
    "related": {
      "events": "string",
      "followers": "string",
      "messages": "string",
      "comments": "string",
      "inboxes": "string",
      "last_message": "string"
    }
  },
  "id": "string",
  "subject": "string",
  "status": "archived",
  "assignee": {
    "_links": {
      "self": "string",
      "related": {
        "inboxes": "string",
        "conversations": "string"
      }
    },
    "id": "string",
    "email": "string",
    "username": "string",
    "first_name": "string",
    "last_name": "string",
    "is_admin": true,
    "is_available": true,
    "is_blocked": true,
    "custom_fields": {}
  },
  "recipient": {
    "_links": {
      "related": {
        "contact": "string"
      }
    },
    "name": "string",
    "handle": "string",
    "role": "from"
  },
  "tags": [
    {
      "_links": {
        "self": "string",
        "related": {
          "conversations": "string",
          "owner": "string",
          "children": "string"
        }
      },
      "id": "string",
      "name": "string",
      "description": "string",
      "highlight": "grey",
      "is_private": true,
      "is_visible_in_conversation_lists": true,
      "created_at": 0,
      "updated_at": 0
    }
  ],
  "links": [
    {
      "_links": {
        "self": "string"
      },
      "id": "string",
      "name": "string",
      "type": "string",
      "external_url": "string",
      "custom_fields": {}
    }
  ],
  "custom_fields": {},
  "created_at": 0,
  "is_private": true,
  "scheduled_reminders": [
    {
      "_links": {
        "related": {
          "owner": "string"
        }
      },
      "created_at": 0,
      "scheduled_at": 0,
      "updated_at": 0
    }
  ],
  "metadata": {
    "external_conversation_ids": [
      "string"
    ]
  }
}