export default {
  "_links": {
    "self": "string",
    "related": {
      "folder": "string",
      "inboxes": "string"
    }
  },
  "id": "tpl_123abc",
  "name": "Welcome Email Template",
  "subject": "Welcome to our service!",
  "body": "<p>Welcome to our service! We're excited to have you on board.</p><p>Best regards,<br>The Team</p>",
  "folder_id": "fol_123abc",
  "inbox_ids": [
    "inb_123abc",
    "inb_456def"
  ],
  "attachments": [
    {
      "filename": "welcome-guide.pdf",
      "url": "string",
      "content_type": "application/pdf",
      "size": 1024000
    }
  ],
  "created_at": 1640995200,
  "updated_at": 1640995200,
  "is_available_for_all_inboxes": false,
  "folder": {
    "_links": {
      "self": "string",
      "related": {
        "owner": "string"
      }
    },
    "id": "fol_123abc",
    "name": "Customer Onboarding",
    "description": "Templates for customer onboarding process"
  },
  "inboxes": [
    {
      "_links": {
        "self": "string",
        "related": {
          "conversations": "string",
          "teammates": "string",
          "channels": "string",
          "owner": "string"
        }
      },
      "id": "inb_123abc",
      "name": "Support Inbox",
      "is_private": false
    }
  ]
}; 