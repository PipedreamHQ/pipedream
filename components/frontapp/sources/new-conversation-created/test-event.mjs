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
  "id": "cnv_123abc",
  "subject": "New conversation subject",
  "status": "open",
  "assignee": {
    "_links": {
      "self": "string",
      "related": {
        "inboxes": "string",
        "conversations": "string"
      }
    },
    "id": "tea_123abc",
    "email": "teammate@example.com",
    "username": "teammate",
    "first_name": "John",
    "last_name": "Doe",
    "is_admin": false,
    "is_available": true,
    "is_blocked": false,
    "custom_fields": {}
  },
  "recipient": {
    "_links": {
      "related": {
        "contact": "string"
      }
    },
    "name": "Customer Name",
    "handle": "customer@example.com",
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
      "id": "tag_123abc",
      "name": "urgent",
      "description": "Urgent conversations",
      "highlight": "red",
      "is_private": false,
      "is_visible_in_conversation_lists": true,
      "created_at": 1640995200,
      "updated_at": 1640995200
    }
  ],
  "links": [
    {
      "_links": {
        "self": "string"
      },
      "id": "link_123abc",
      "name": "Related Ticket",
      "type": "string",
      "external_url": "https://example.com/ticket/123",
      "custom_fields": {}
    }
  ],
  "custom_fields": {},
  "created_at": 1640995200,
  "is_private": false,
  "scheduled_reminders": [
    {
      "_links": {
        "related": {
          "owner": "string"
        }
      },
      "created_at": 1640995200,
      "scheduled_at": 1641081600,
      "updated_at": 1640995200
    }
  ],
  "metadata": {
    "external_conversation_ids": [
      "external_123"
    ]
  }
}; 