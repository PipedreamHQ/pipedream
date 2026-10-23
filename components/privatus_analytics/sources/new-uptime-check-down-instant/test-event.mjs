export default {
  "id": "whd_9K3M7QX2PL",
  "event": "uptime.down",
  "occurred_at": "2026-10-20T10:15:00Z",
  "workspace_id": "ws_5N8D2WLE4C",
  "check": {
    "id": "upc_4M8X2TQ7LB",
    "workspace_id": "ws_5N8D2WLE4C",
    "site_id": "pa_7Q2K9XH3AB",
    "name": "example.com homepage",
    "kind": "http",
    "url": "https://example.com/",
    "host": null,
    "port": null,
    "keyword": null,
    "expected_status": 200,
    "http_method": "GET",
    "interval_seconds": 300,
    "timeout_seconds": 20,
    "status": "down",
    "enabled": true,
    "public": false,
    "last_checked_at": "2026-10-20T10:15:00.000Z",
    "next_check_at": "2026-10-20T10:20:00.000Z",
    "last_response_ms": null,
    "ssl_expires_at": "2027-01-12T00:00:00.000Z",
    "ssl_issuer": "Let's Encrypt",
    "domain_expires_at": "2027-08-14T00:00:00.000Z",
    "created_at": "2026-09-01T12:00:00.000Z",
    "uptime": {
      "24h": 99.652,
      "7d": 99.9,
      "30d": 99.97
    }
  },
  "incident": {
    "started_at": "2026-10-20T10:10:00.000Z",
    "resolved_at": null,
    "duration_seconds": 300,
    "cause": "HTTP 503",
    "failed_locations": [
      "us-east",
      "eu-west"
    ]
  }
};
