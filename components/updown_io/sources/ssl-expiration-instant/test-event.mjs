export default {
  "event": "check.ssl_expiration",
  "time": "2024-03-15T21:12:08Z",
  "description": "The SSL certificate served by updown.io will expire in 7 days",
  "check": {
    "token": "xyz0",
    "url": "https://updown.io",
    "alias": null,
    "last_status": 200,
    "uptime": 100,
    "down": false,
    "down_since": null,
    "up_since": "2024-02-15T21:12:08Z",
    "error": null,
    "period": 30,
    "apdex_t": 0.25,
    "string_match": "",
    "enabled": true,
    "published": true,
    "disabled_locations": [],
    "recipients": [
      "email:497723868",
      "webhook:1300810874",
      "webhook:3808246510"
    ],
    "last_check_at": "2024-03-15T21:11:53Z",
    "next_check_at": "2024-03-15T21:12:23Z",
    "created_at": null,
    "mute_until": null,
    "favicon_url": "https://updown.io/favicon.png",
    "custom_headers": {},
    "http_verb": "GET/HEAD",
    "http_body": ""
  },
  "ssl": {
    "cert": {
      "subject": "updown.io",
      "issuer": "Let's Encrypt Authority X3 (Let's Encrypt)",
      "from": "2018-09-08T21:00:18Z",
      "to": "2018-12-07T21:00:18Z",
      "algorithm": "SHA-256 with RSA encryption"
    },
    "days_before_expiration": 7
  }
}