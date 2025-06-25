export default {
  "id": "12345678-abcd-1234-efgh-123456789abc",
  "type": "technology_detection",
  "attributes": {
    "first_seen_at": "2024-01-15T10:30:00Z",
    "last_seen_at": "2024-01-20T14:45:30Z",
    "behind_firewall": false,
    "score": 0.85
  },
  "relationships": {
    "company": {
      "data": {
        "id": "11111111-2222-3333-4444-555555555555",
        "type": "company"
      }
    },
    "seen_on_job_openings": {
      "data": [
        {
          "id": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
          "type": "job_opening"
        },
        {
          "id": "ffffffff-gggg-hhhh-iiii-jjjjjjjjjjjj",
          "type": "job_opening"
        }
      ]
    },
    "seen_on_subpages": {
      "data": []
    },
    "seen_on_dns_records": {
      "data": []
    },
    "seen_on_connection": {
      "data": null
    },
    "technology": {
      "data": {
        "id": "99999999-8888-7777-6666-555555555555",
        "type": "technology"
      }
    }
  }
}; 