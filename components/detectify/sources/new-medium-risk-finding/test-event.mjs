export default {
  "asset": {
    "name": "string",
    "token": "string"
  },
  "asset_token": "string",
  "cookie": {
    "domain": "string",
    "expires": "2019-08-24T14:15:22Z",
    "httponly": true,
    "name": "string",
    "path": "string",
    "secure": true,
    "value": "string"
  },
  "created_at": "2020-01-01T01:01:00Z",
  "cvss_scores": {
    "cvss_2_0": {
      "score": 0,
      "severity": "medium",
      "vector": "string"
    },
    "cvss_3_0": {
      "score": 0,
      "severity": "medium",
      "vector": "string"
    },
    "cvss_3_1": {
      "score": 0,
      "severity": "medium",
      "vector": "string"
    }
  },
  "cwe": 0,
  "definition": {
    "description": "string",
    "is_crowdsourced": true,
    "module_release": "2019-08-24T14:15:22Z",
    "module_version": "string",
    "risk": "string",
    "title": "string"
  },
  "details": {
    "geography": [
      {
        "city": "string",
        "country_code": "string",
        "country_name": "string",
        "highlights": [
          {
            "field": "string",
            "length": 0,
            "offset": 0,
            "value": "string"
          }
        ],
        "latitude": "string",
        "longitude": "string",
        "region": "string",
        "topic": "string",
        "zip": "string"
      }
    ],
    "graph": [
      {
        "data": {
          "property1": [
            0
          ],
          "property2": [
            0
          ]
        },
        "highlights": [
          {
            "field": "string",
            "length": 0,
            "offset": 0,
            "value": "string"
          }
        ],
        "topic": "string",
        "unit": "string"
      }
    ],
    "html": [
      {
        "highlights": [
          {
            "field": "string",
            "length": 0,
            "offset": 0,
            "value": "string"
          }
          ],
        "topic": "string",
        "value": "string"
      }
    ],
    "image": [
      {
        "height": 0,
        "highlights": [
          {
            "field": "string",
            "length": 0,
            "offset": 0,
            "value": "string"
          }
        ],
        "link": "string",
        "topic": "string",
        "width": 0
      }
    ],
    "markdown": [
      {
        "fallback": "string",
        "highlights": [
          {
            "field": "string",
            "length": 0,
            "offset": 0,
            "value": "string"
          }
        ],
        "topic": "string",
        "value": "string"
      }
    ],
    "text": [
      {
        "highlights": [
          {
            "field": "string",
            "length": 0,
            "offset": 0,
            "value": "string"
          }
        ],
        "topic": "string",
        "value": "string"
      }
    ],
    "video": [
      {
        "highlights": [
          {
            "field": "string",
            "length": 0,
            "offset": 0,
            "value": "string"
          }
        ],
        "link": "string",
        "topic": "string"
      }
    ]
  },
  "host": "admin.example.com",
  "links": {
    "details_page": "string"
  },
  "location": "https://example.com/login.php",
  "owasp": [
    {
      "classification": "string",
      "year": 0
    }
  ],
  "references": [
    {
      "link": "string",
      "name": "string",
      "source": "string",
      "uuid": "string"
    }
  ],
  "request": {
    "body": "string",
    "headers": [
      {
        "name": "string",
        "uuid": "string",
        "value": "string"
      }
    ],
    "method": "string",
    "url": "string"
  },
  "response": {
    "body": "string",
    "headers": [
      {
        "name": "string",
        "uuid": "string",
        "value": "string"
      }
    ],
    "status_code": 0
  },
  "scan_profile_token": "string",
  "scan_source": "string",
  "severity": "medium",
  "source": {
    "value": "string"
  },
  "status": "string",
  "tags": [
    {
      "name": "string",
      "uuid": "string"
    }
  ],
  "title": "string",
  "updated_at": "2020-01-01T01:01:00Z",
  "uuid": "string",
  "version": "string"
}