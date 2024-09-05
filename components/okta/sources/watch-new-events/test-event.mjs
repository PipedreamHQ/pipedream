export default {
  "actor": {
    "alternateId": "string",
    "detailEntry": {
      "property1": {},
      "property2": {}
    },
    "displayName": "string",
    "id": "string",
    "type": "string"
  },
  "authenticationContext": {
    "authenticationProvider": "ACTIVE_DIRECTORY",
    "authenticationStep": 0,
    "credentialProvider": "DUO",
    "credentialType": "ASSERTION",
    "externalSessionId": "string",
    "interface": "string",
    "issuer": {
      "id": "string",
      "type": "string"
    }
  },
  "client": {
    "device": "string",
    "geographicalContext": {
      "city": "string",
      "country": "string",
      "geolocation": {
        "lat": 0,
        "lon": 0
      },
      "postalCode": "string",
      "state": "string"
    },
    "id": "string",
    "ipAddress": "string",
    "userAgent": {
      "browser": "string",
      "os": "string",
      "rawUserAgent": "string"
    },
    "zone": "string"
  },
  "debugContext": {
    "debugData": {
      "property1": {},
      "property2": {}
    }
  },
  "displayMessage": "string",
  "eventType": "string",
  "legacyEventType": "string",
  "outcome": {
    "reason": "string",
    "result": "string"
  },
  "published": "2019-08-24T14:15:22Z",
  "request": {
    "ipChain": [
      {
        "geographicalContext": {
          "city": "string",
          "country": "string",
          "geolocation": {
            "lat": 0,
            "lon": 0
          },
          "postalCode": "string",
          "state": "string"
        },
        "ip": "string",
        "source": "string",
        "version": "string"
      }
    ]
  },
  "securityContext": {
    "asNumber": 0,
    "asOrg": "string",
    "domain": "string",
    "isp": "string",
    "isProxy": true
  },
  "severity": "DEBUG",
  "target": [
    {
      "alternateId": "string",
      "changeDetails": {
        "from": {
          "property1": {},
          "property2": {}
        },
        "to": {
          "property1": {},
          "property2": {}
        }
      },
      "detailEntry": {
        "property1": {},
        "property2": {}
      },
      "displayName": "string",
      "id": "string",
      "type": "string"
    }
  ],
  "transaction": {
    "detail": {
      "property1": {},
      "property2": {}
    },
    "id": "string",
    "type": "string"
  },
  "uuid": "string",
  "version": "string"
}