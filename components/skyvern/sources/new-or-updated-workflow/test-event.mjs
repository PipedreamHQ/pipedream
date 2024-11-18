export default {
  "workflow_id": "string",
  "organization_id": "string",
  "title": "string",
  "workflow_permanent_id": "string",
  "version": "integer",
  "is_saved_task": "boolean",
  "description": "string",
  "proxy_location": "string | null",
  "webhook_callback_url": "string | null",
  "totp_verification_url": "string | null",
  "workflow_definition": {
    "parameters": [
      {
        "parameter_type": "string",
        "key": "string",
        "description": "string | null"
      }
    ],
    "blocks": [
      {
        "label": "string",
        "block_type": "string"
      }
    ]
  }
}