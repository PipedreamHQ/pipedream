export default {
  "name": "Andy Fowler",
  "owner": {
      "entityType": "Users",
      "id": 1
  },
  "description": "Beagle owner",
  "phone": [ "717-555-0480", "+216 707-555-2903", "877-555-5555" ],
  "email": ["andy@gmail.com", "fowler@charter.net" ],
  "address": [
      {
          "address_1":  "100 Main St.",
          "address_2":  "Apt. 1",
          "address_3":  "c/o Barclay Fowler",
          "city":       "Ann Arbor",
          "state":      "MI",
          "postalCode": "48103",  // or "48103-1234"
          "country":    "US"
      }
  ],
  "leads": [
      {
          "relationship": "First contact at company",
          "id": 24,
      },
  ],
  "accounts": [
      {
          "relationship": "Lead Developer",
          "id": 111,
      },
  ],
  "customFields": {
      "Job Title": "Lead Developer",
  },
  "territoryId": "10",
  "audiences": [
      {
          "id": 111,
      },
  ]
}