export default {
  "event": "kudos.posted",
  "event_timestamp": 1707157378.851941,
  "hook": {
    "id": "12345678-1234-1234-1234-123456789012",
    "name": "Webhook Name",
  },
  "body": {
    "organization_uuid": "12345678-1234-1234-1234-123456789012",
    "uuid": "12345678-1234-1234-1234-123456789012",
    "company_value": null,
    "giver": {
      "uuid": "12345678-1234-1234-1234-123456789012",
      "full_name": "Giver Full Name",
      "image": "https://avatars.slack-edge.com/2022-06-21/image.png",
      "language": "us",
      "timezone": "America/New_York",
      "is_active": true,
      "is_approved": true,
    },
    "receivers": [
      {
        "uuid": "12345678-1234-1234-1234-123456789012",
        "full_name": "Receiver Full Name",
        "image": "https://avatars.slack-edge.com/2022-06-21/image.jpg",
        "language": "us",
        "timezone": "America/New_York",
        "is_active": true,
        "is_approved": true,
      },
    ],
    "content": "content text",
    "is_anonymous": false,
  },
};
